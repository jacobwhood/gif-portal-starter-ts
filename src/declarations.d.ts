interface SolanaConnectResponse {
    publicKey: string;
};

interface SolanaConnectOptions {
    onlyIfTrusted?: boolean;
}

export declare global {
    interface Window {
        solana: {
            isPhantom: boolean;
            request: ({}: { method: 'connect', params?: SolanaConnectOptions }) => Promise<SolanaConnectResponse>;
            connect: (opts?: SolanaConnectOptions) => Promise<SolanaConnectResponse>;
            on: (event: string, handler: () => void) => void;
        } | undefined;
    }
}
