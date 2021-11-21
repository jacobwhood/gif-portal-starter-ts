import { useCallback, useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
    const checkIfWalletIsConnected = useCallback(async () => {
        try {
            const { solana } = window;

            if (solana && solana.isPhantom) {
                console.log('Phantom wallet found! 😎');

                /*
                * The solana object gives us a function that will allow us to connect
                * directly with the user's wallet!
                */
                const response = await solana.connect({ onlyIfTrusted: true });
                console.log(`Connected with Public Key: ${response.publicKey.toString()}`);

                /*
                * Set the user's publicKey in state to be used later!
                */
                setWalletAddress(response.publicKey.toString());
            } else {
                alert('Solana object not found! Get a Phantom Wallet 👻');
            }
        } catch (error) {
            console.error(error);
        }
    }, [window.solana]);

    /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
    const connectWallet = useCallback(async (): Promise<void> => {
        const { solana } = window;
        if (solana) {
            const response = await solana.connect();
            console.log('You\'re now connected! 😎');
            setWalletAddress(response.publicKey.toString());
        }
    }, [window.solana]);

    /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
    useEffect(() => {
        const onLoad = async (): Promise<void> => {
            await checkIfWalletIsConnected();
            setIsLoading(false);
        };
        window.addEventListener('load', onLoad);

        return (): void => {
            window.removeEventListener('load', onLoad)
        };
    }, []);

    return (
        <div className="App">
            {isLoading
                ? (<div className="container" style={{ color: 'white' }}>Loading...</div>)
                : (
                    <div className={walletAddress ? 'authed-container' : 'container'}>
                        <div className="header-container">
                            <p className="header">🖼 GIF Portal</p>
                            <p className="sub-text">
                                View your GIF collection in the metaverse ✨
                            </p>
                            {walletAddress !== null
                                ? (<p className="sub-text">You're already connected with key: {walletAddress}</p>)
                                : (
                                    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
                                        Connect to Wallet
                                    </button>
                                )
                            }
                        </div>
                        <div className="footer-container">
                            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                            <a
                                className="footer-text"
                                href={TWITTER_LINK}
                                target="_blank"
                                rel="noreferrer"
                            >{`built on @${TWITTER_HANDLE}`}</a>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default App;
