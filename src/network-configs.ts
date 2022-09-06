export type Network = {
    messagePrefix: string
    bech32: string
    bip32: Bip32
    pubKeyHash: number
    scriptHash: number
    wif: number
    dustThreshold: number
    timeInTransaction: boolean
    maximumFeeRate?: number
}

type Bip32 = {
    public: number
    private: number
}

type NetworkConfig = {
    mainnet: Network
    testnet: Network
    regtest?: Network
}

const bitcoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        dustThreshold: 546,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        dustThreshold: 546,
        timeInTransaction: false,
    },
}

const litecoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bech32: 'ltc',
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe,
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0,
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Litecoin Signed Message:\n',
        bech32: 'tltc',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        dustThreshold: 500,
        timeInTransaction: false,
        maximumFeeRate: 50000,
    },
}

const dogecoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bech32: 'xdg',
        bip32: {
            public: 0x02facafd,
            private: 0x02fac398,
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e,
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Dogecoin Signed Message:\n',
        bech32: 'xdg',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x71,
        scriptHash: 0xc4,
        wif: 0xf1,
        dustThreshold: 0,
        timeInTransaction: false,
    },
}

const dashcoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x18Dashcoin Signed Message:\n',
        bech32: 'dash',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc,
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Dashcoin Signed Message:\n',
        bech32: 'dash',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x8c,
        scriptHash: 0x13,
        wif: 0xef,
        dustThreshold: 500,
        timeInTransaction: false,
        maximumFeeRate: 50000,
    },
}

// TODO fill correct values for polkadot
const polkadot: NetworkConfig = {
    mainnet: {
        messagePrefix: 'unused',
        bech32: 'dot',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: 'unused',
        bech32: 'dot',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0x80,
        dustThreshold: 0,
        timeInTransaction: false,
    },
}

const tron: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x19TRON Signed Message:\n32', // x15 for tronlink x19 for others
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e, // xpub
            private: 0x0488ade4, // xprv
        },
        pubKeyHash: 0x41, // T as first letter of address
        scriptHash: 0x05, // unused
        wif: 0x80, // unused
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x19TRON Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf, // tpub
            private: 0x04358394, // tprv
        },
        pubKeyHash: 0x41,
        scriptHash: 0x05,
        wif: 0x80,
        dustThreshold: 0,
        timeInTransaction: false,
    },
}

export { bitcoin, litecoin, dogecoin, dashcoin, polkadot, tron }
