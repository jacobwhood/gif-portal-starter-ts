import { CSSProperties } from 'react';
import { GifData, GifView } from './GifView';

interface GifContainerProps {
    gifList: GifData[];
    handleUpvoteGif: (gifLink: string) => void;
    handleSendSol: (gifData: GifData, amount: number) => Promise<void>;
}

export const GifContainer = ({ gifList, handleUpvoteGif, handleSendSol }: GifContainerProps): JSX.Element => {
    return (
        <div className="gif-container">
            <div className="gif-grid">
                {gifList.sort((a, b) =>  parseInt(b.voteCount) - parseInt(a.voteCount, 10)).map((gif, index) => (
                    <GifView gif={gif} key={index} handleUpvoteGif={handleUpvoteGif} handleSendSol={handleSendSol} />
                ))}
            </div>
        </div>
    );
};
