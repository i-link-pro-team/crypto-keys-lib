import { IKeys, Blockchain, Network, SeedDictionaryLang, SeedWithKeys, FromSeedPhrase, FromMasterPublicKey, FromMasterPrivateKey, PathCursor, KeysWithPath, PrivateKey, PublicKey, Address, Path } from './types';
export declare class Keys implements IKeys {
    private lib;
    private blockchain;
    constructor(blockchain: Blockchain, network: Network);
    private getMasterFromSeed;
    private isSeed;
    private isMasterPrivate;
    generateSeedPhrase(wordCount: 12 | 24, lang?: SeedDictionaryLang, path?: string, password?: string): Promise<SeedWithKeys | Error>;
    getDataFromSeed(seedPhrase: string, path?: string, password?: string): Promise<SeedWithKeys | Error>;
    derivateKeys(from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey, pathCursor: PathCursor): Promise<KeysWithPath[] | Error>;
    sign(data: string, privateKey: PrivateKey, isTx?: boolean, addMessagePrefix?: boolean): Promise<string | Error>;
    getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error;
    getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error;
    checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error;
    checkSeedPhrase(seedPhrase: string): boolean | Error;
    getDefaultPaths(): Path[];
    isValidAddress(address: string, format?: string): boolean;
    getFormat(address: string): string;
    static decrypt(encryptedData: string, password: string): Promise<string>;
    static encrypt(data: string, password: string): Promise<string>;
}
