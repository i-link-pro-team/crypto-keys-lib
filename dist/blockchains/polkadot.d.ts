import { BitcoinBase } from './bitcoin-base';
import { Blockchain, KeysWithPath, MasterKeys, Network, PathCursor, SeedWithKeys } from '../types';
import { Keyring } from '@polkadot/keyring';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
export declare class Polkadot extends BitcoinBase {
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
    private offlineApi;
    private readonly network;
    private readonly passphrase;
    constructor(network: Network);
    getPublicFromPrivate(privateKey: string, isWIF?: boolean): string;
    getAddressFromPublic(publicKey: string): string;
    checkSign(publicKey: string, data: string, sign: string): boolean;
    sign(data: string, privateKey: string, isTx: any): Promise<string>;
    getMasterFromSeed(seedPhrase: string, path?: string, password?: string): Promise<SeedWithKeys>;
    getMasterAddressFromSeed(seed: string, path?: string): Promise<MasterKeys>;
    derivateFromPrivate(masterPrivateKey: string, cursor: PathCursor): KeysWithPath[];
    getPath(path: string, isAccount: boolean): string;
    isValidAddress(address: string): boolean;
    createSubmittableExtrinsic(txJson: string): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>>;
    getKeyring(): Keyring;
    derivateFromPublic(masterPublicKey: string, cursor: PathCursor): KeysWithPath[];
}
