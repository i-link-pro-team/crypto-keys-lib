import { BitcoinBase } from './bitcoin-base';
import { Blockchain, KeysWithPath, Network, PathCursor } from '../types';
import * as bip32 from 'bip32';
export declare class Tron extends BitcoinBase {
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
    sign(data: string, privateKey: string, isTx?: boolean): Promise<string>;
    ECKeySign(hashBytes: any, priKeyBytes: any): string;
    protected getPrivateKey(privateKey: bip32.BIP32Interface): string;
    derivateFromPrivate(masterPrivateKey: string, cursor: PathCursor): KeysWithPath[];
    derivateFromPublic(masterPublicKey: string, cursor: PathCursor): KeysWithPath[];
    getPublicFromPrivate(privateKey: string, isWIF?: boolean): string;
    getAddressFromPublic(publicKey: string): string;
    computeAddress(pubBytes: any): any[];
    getTronPubKeyFromPubKey(PubKeyBytes: any): string;
    isValidAddress(base58Str: any): boolean;
    getPubKeyFromPriKey(priKeyBytes: any): string;
    decode58(string: any): number[];
    encode58(buffer: any): string;
    SHA256(msgBytes: any): any[];
    byteArray2hexStr(byteArray: any): string;
    byte2hexStr(byte: any): string;
    getBase58CheckAddress(addressBytes: any): string;
    hexStr2byteArray(str: any, strict?: boolean): any[];
    isHexChar(c: any): 0 | 1;
    hexChar2byte(c: any): number;
    stringToBytes(str: any): any[];
    bytesToString(arr: any): string;
}
