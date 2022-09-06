import { BIP32Interface } from 'bip32';
import { Blockchain, Network } from '../types';
import { BitcoinBase } from './bitcoin-base';
export declare class Ethereum extends BitcoinBase {
    protected networks: {
        mainnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: import("../network-configs").Network;
        };
        testnet: {
            blockchain: Blockchain;
            network: Network;
            path: string;
            config: import("../network-configs").Network;
        };
    };
    protected net: Network;
    constructor(network: Network);
    getPublicFromPrivate(privateKey: string): string;
    getPrivateKey(privateKey: BIP32Interface): string;
    getPublicKey(publicKey: string): string;
    getAddressFromPublic(publicKey: string): string;
    sign(data: string, privateKey: string, isTx?: boolean, addMessagePrefix?: boolean): Promise<string>;
    checkSign(_: string, __: string, sign: string): boolean;
    isValidAddress(address: string): boolean;
}
