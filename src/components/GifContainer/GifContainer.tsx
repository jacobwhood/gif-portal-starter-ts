import { TEST_GIFS } from '../../test-data';

export type GifData = {
    gifLink: string;
}

interface GifContainerProps {
    walletAddress: string;
    gifList: GifData[];
}

export const GifContainer = ({ walletAddress, gifList }: GifContainerProps): JSX.Element => {
    return (
        <div className="connected-container">
            <div className="gif-grid">
                {gifList.map((gif, index) => (
                    <div className="gif-item" key={index}>
                        <img src={gif.gifLink} alt={'An awesome GIF!'} />
                    </div>
                ))}
            </div>
        </div>
    );
};
