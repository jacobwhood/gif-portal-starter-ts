import { TEST_GIFS } from '../test-data';

interface GifContainerProps {
    walletAddress: string;
    gifList: string[];
}

export const GifContainer = ({ walletAddress }: GifContainerProps): JSX.Element => {
    return (
        <div className="connected-container">
            <div className="gif-grid">
                {TEST_GIFS.map(gif => (
                    <div className="gif-item" key={gif}>
                        <img src={gif} alt={gif} />
                    </div>
                ))}
            </div>
        </div>
    );
};
