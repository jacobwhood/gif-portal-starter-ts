interface DefaultContainerProps {
    connectWallet: () => Promise<void>;
}

export const DefaultContainer = ({ connectWallet }: DefaultContainerProps): JSX.Element => {
    return (
        <div className="default-container">
            <button className="cta-button connect-wallet-button" onClick={connectWallet}>
                    Connect to Wallet
            </button>
        </div>
    );
};
