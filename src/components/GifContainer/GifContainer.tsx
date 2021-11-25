import { CSSProperties, MouseEvent } from 'react';

export type GifData = {
    gifLink: string;
    userAddress: string;
    voteCount: string;
}

interface GifContainerProps {
    gifList: GifData[];
    handleUpvoteGif: (gifLink: string) => void;
}

export const GifContainer = ({ gifList, handleUpvoteGif }: GifContainerProps): JSX.Element => {
    return (
        <div className="gif-container">
            <div className="gif-grid">
                {gifList.map((gif, index) => (
                    <div className="gif-item" key={index}>
                        <img src={gif.gifLink} alt={'An awesome GIF!'} />
                        <div className="user-address-container" style={userAddressContainerStyle}>
                            <div>Submitted by:</div>
                            <div>{gif.userAddress.toString()}</div>
                        </div>
                        <div className="vote-info-container" style={voteInfoContainerStyle}>
                            <div>vote count: {gif.voteCount ?? 0}</div>
                            <button
                                onClick={(e: MouseEvent): void => handleUpvoteGif(gif.gifLink)}
                                style={{ height: '80%' }}>upvote 👍</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const userAddressContainerStyle: CSSProperties = {
    color: 'white',
    marginTop: '8px',
    marginBottom: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    backgroundColor: 'rgba(53, 174, 226, 0.3)',
    width: '100%'
};

const voteInfoContainerStyle: CSSProperties = {
    color: 'white',
    backgroundColor: 'rgba(78,68,206, 0.3)',
    display: 'flex',
    alignContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '45px'
};
