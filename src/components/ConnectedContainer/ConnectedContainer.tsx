import {
    ChangeEvent as ReactChangeEvent,
    FormEvent as ReactFormEvent,
    useCallback,
    useEffect,
    useState
} from 'react';
import { TEST_GIFS } from '../../test-data';
import { GifContainer } from '../GifContainer/GifContainer';

interface ConnectedContainerProps {
    walletAddress: string;
}

export const ConnectedContainer = ({ walletAddress }: ConnectedContainerProps): JSX.Element => {
    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState<string[]>([]);

    const handleFormSubmit = useCallback(async (event: ReactFormEvent): Promise<void> => {
        event.preventDefault();
        if (inputValue.trim().length > 0) {
            console.log('Gif link:', inputValue);
        } else {
            console.log('Empty input. Try again.');
        }
    }, [inputValue]);

    useEffect(() => {
        console.log('Fetching GIF list...');
    
        // Call Solana program here.

        // Set state
        setGifList(TEST_GIFS);
    }, [walletAddress]);

    return (
        <div className="connected-container">
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Enter gif link!"
                    value={inputValue}
                    onChange={(e: ReactChangeEvent<HTMLInputElement>): void => {
                        setInputValue(e.target.value.trim());
                    }} />
                <button type="submit" className="cta-button submit-gif-button">Submit</button>
            </form>
            <GifContainer walletAddress={walletAddress} gifList={gifList} />
        </div>
    );
};
