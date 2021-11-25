import { CSSProperties, ChangeEvent, useCallback, useState } from 'react';

export type GifData = {
    gifLink: string;
    userAddress: string;
    voteCount: string;
}

const INVALID_TIP_AMOUNT_ERROR_MESSAGE = 'Invalid tip amount. Please enter a positive number and try again.';
const GENERIC_TIP_ERROR_MESSAGE = 'Error when attempting to send tip. please try again.';
const SEND_TIP_SUCCESS_MESSAGE = 'Your tip was successfully sent! Thanks for the donation. wagmi 😎';

interface GifViewProps {
    gif: GifData,
    handleUpvoteGif: (gifLink: string) => void;
    handleSendSol: (gifData: GifData, amount: number) => Promise<void>;
}

export const GifView = ({ gif, handleUpvoteGif, handleSendSol }: GifViewProps): JSX.Element => {
    const [tipAmount, setTipAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleTipValidationAndSend = useCallback(async (gifData: GifData) => {
        try {
            const parsedTipAmount = parseFloat(tipAmount);
            if (parsedTipAmount <= 0 || isNaN(parsedTipAmount)) {
                setErrorMessage(INVALID_TIP_AMOUNT_ERROR_MESSAGE);
                setTipAmount('');
                return;
            }

            await handleSendSol(gifData, parsedTipAmount);
            setTipAmount('');
            setSuccessMessage(SEND_TIP_SUCCESS_MESSAGE);
        } catch (e) {
            setTipAmount('');
            setErrorMessage(GENERIC_TIP_ERROR_MESSAGE);
        }
    }, [handleSendSol, tipAmount]);

    return (
        <div className="gif-item">
            <img src={gif.gifLink} alt={'An awesome GIF!'} />
            <div className="user-address-container" style={userAddressContainerStyle}>
                <div style={{ paddingLeft: '12px' }}>
                    Submitted by:
                </div>
                <div style={{ paddingLeft: '12px', paddingBottom: '8px' }}>
                    {gif.userAddress.toString()}
                </div>
                <div style={voteInfoContainerStyle}>
                    <div style={{ marginRight: '12px', marginLeft: '12px' }}>
                        vote count: {gif.voteCount ?? 0}
                    </div>
                    <button
                        className="base-button cta-button"
                        onClick={(): void => handleUpvoteGif(gif.gifLink)}
                        style={buttonStyle}>
                            upvote 👍
                    </button>
                </div>
                <div className="gif-action-container" style={gifActionContainerStyle}>
                    <div style={tipContainerStyle}>
                        <input
                            value={tipAmount}
                            className="tip-input"
                            type="text"
                            placeholder="Tip amount (SOL)"
                            style={{ height: '100%', marginRight: '12px', marginLeft: '12px' }}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                if (errorMessage !== null) {
                                    setErrorMessage('');
                                }
                                setTipAmount(e.target.value)
                            }} />
                        <button
                            className="base-button cta-button"
                            onClick={(): Promise<void> => handleTipValidationAndSend(gif)}
                            style={buttonStyle}>
                                Send tip
                        </button>
                    </div>
                    {errorMessage !== null &&
                        <div className="error-message-container" style={errorMessageStyle}>
                            <span style={{ paddingLeft: '12px' }}>{errorMessage}</span>
                        </div>
                    }
                    {successMessage !== null &&
                        <div className="success-message-container" style={successMessageStyle}>
                            <span style={{ paddingLeft: '12px' }}>{successMessage}</span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};


const userAddressContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '22px',
    alignItems: 'flex-start',
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
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    paddingBottom: '8px',
    backgroundColor: 'rgba(53, 174, 226, 0.1)',
    height: '75px'
};

const gifActionContainerStyle: CSSProperties = {
    color: 'white',
    backgroundColor: 'rgba(78,68,206, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100px',
    width: '100%'
};

const tipContainerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '4px',
    paddingBottom: '4px'
};

const buttonStyle: CSSProperties = {
    paddingTop: '4px',
    paddingBottom: '4px',
    marginRight: '12px',
    width: '155px'
};

const errorMessageStyle: CSSProperties = {
    width: '100%',
    color: 'palevioletred',
    textTransform: 'uppercase',
    fontSize: '14px',
    textAlign: 'left'
};

const successMessageStyle: CSSProperties = {
    color: 'chartreuse',
    textTransform: 'uppercase',
    fontSize: '14px'
};
