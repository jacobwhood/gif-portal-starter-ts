import idl from '../../idl.json';
import * as keyPair from '../../utils/keypair.json';

import {
    ChangeEvent as ReactChangeEvent,
    FormEvent as ReactFormEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';
import { ConfirmOptions, Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Idl, Program, Provider, web3 } from '@project-serum/anchor';

import { GifContainer } from '../GifContainer/GifContainer';
import { GifData } from '../GifContainer/GifView';

interface ConnectedContainerProps {
    walletAddress: string;
}

export const ConnectedContainer = ({ walletAddress }: ConnectedContainerProps): JSX.Element => {
    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState<GifData[] | null>(null);

    // SystemProgram is a reference to the Solana runtime!
    const { SystemProgram } = web3;
    // Create a keypair for the account that will hold the GIF data.
    const baseAccount = useMemo(() => {
        const arr = Object.values(keyPair._keypair.secretKey);
        const secret = new Uint8Array(arr);

        // Get our program's id from the IDL file.
        return web3.Keypair.fromSecretKey(secret);
    }, [keyPair._keypair.secretKey]);
    const programID = new PublicKey(idl.metadata.address);

    const handleFormSubmit = useCallback(async (event: ReactFormEvent): Promise<void> => {
        event.preventDefault();
        if (inputValue.trim().length === 0) {
            console.log('Empty input. Try again.');
            return;
        }

        try {
            const { provider } = getWeb3Entites();
            const program = new Program(idl as Idl, programID, provider);

            await program.rpc.addGif(inputValue, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey
                }
            });
            console.log('GIF successfully sent to program', inputValue);

            await getGifList();
            setInputValue('');
        } catch (error) {
            console.log('Error sending GIF:', error);
        }

        console.log(`Gif link: ${inputValue}`);
    }, [inputValue]);

    const getWeb3Entites = useCallback(() => {
        // Set our network to devnet.
        const network = clusterApiUrl('devnet');
        
        // Controls how we want to acknowledge when a transaction is "done".
        const opts: ConfirmOptions = { preflightCommitment: 'processed' };
        const connection = new Connection(network, opts.preflightCommitment as web3.Commitment);
        const provider = new Provider(connection, window.solana as any, { preflightCommitment: 'processed' });

        return {
            connection,
            provider
        };
    }, []);

    const getGifList = useCallback(async () => {
        try {
            const { provider } = getWeb3Entites();
            const program = new Program(idl as Idl, programID, provider);
            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
            console.log(`Got the account ${JSON.stringify(account)}`);
            setGifList(account.gifList);
        } catch (error) {
            console.log(`Error in getGifList: ${error}`);
            setGifList(null);
        }
    }, [getWeb3Entites, baseAccount]);

    const createGifAccount = useCallback(async () => {
        try {
            const { provider } = getWeb3Entites();
            const program = new Program(idl as Idl, programID, provider);
            console.log('ping')
            await program.rpc.startStuffOff({
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId
                },
                signers: [baseAccount]
            });
            console.log('Created a new BaseAccount w/ address:', baseAccount.publicKey.toString());
            await getGifList();

        } catch(error) {
            console.log('Error creating BaseAccount account:', error);
        }
    }, [idl, programID, baseAccount.publicKey, SystemProgram.programId]);

    const upvoteGif = useCallback(async (gifLink: string) => {
        try {
            const { provider } = getWeb3Entites();
            const program = new Program(idl as Idl, programID, provider);

            await program.rpc.upvoteGif(gifLink, {
                accounts: {
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey
                }
            });
            console.log('GIF successfully upvoted');
            await getGifList();
        } catch (error) {
            console.log('Error upvoting GIF:', error);
        }
    }, [getWeb3Entites, idl, programID, baseAccount.publicKey]);

    const sendSol = useCallback(async (gifData: GifData, amount: number) => {
        try {
            const { provider, connection } = getWeb3Entites();

            const transaction = new web3.Transaction().add(
                web3.SystemProgram.transfer({
                    fromPubkey: provider.wallet.publicKey,
                    toPubkey: (gifData.userAddress as unknown) as PublicKey,
                    lamports: web3.LAMPORTS_PER_SOL * amount
                })
            );

            transaction.feePayer = provider.wallet.publicKey;
            transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

            // Transaction constructor initialized successfully
            if (transaction) {
                console.log('Txn created successfully');
            }
    
            // Request creator to sign the transaction (allow the transaction)
            const signedTransaction = await provider.send(transaction);
            // Confirm whether the transaction went through or not
            await connection.confirmTransaction(signedTransaction);
            console.log('GIF successfully upvoted');
            await getGifList();
        } catch (error) {
            console.log('Error upvoting GIF:', error);
        }
    }, [getWeb3Entites, idl, programID, baseAccount.publicKey]);

    useEffect(() => {
        if (walletAddress) {
            console.log('Fetching GIF list...');
            getGifList();
        }
    }, [walletAddress]);

    return gifList === null
        ? (
            <>
                <button className="cta-button base-button" onClick={createGifAccount}>
                    Do One-Time Initialization For GIF Program Account
                </button>
            </>
        )
        : (
            <div className="connected-container">
                <form onSubmit={handleFormSubmit} style={{ marginBottom: '12px' }}>
                    <input
                        type="text"
                        placeholder="Enter gif link!"
                        value={inputValue}
                        onChange={(e: ReactChangeEvent<HTMLInputElement>): void => {
                            setInputValue(e.target.value.trim());
                        }} />
                    <button type="submit" className="cta-button base-button">
                        Submit
                    </button>
                </form>
                <GifContainer
                    gifList={gifList}
                    handleUpvoteGif={upvoteGif}
                    handleSendSol={sendSol} />
            </div>
        );
};
