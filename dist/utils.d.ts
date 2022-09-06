/// <reference types="node" />
import baseX from 'base-x';
import { Blockchain } from './types';
export declare const validateMnemonic: (mnemonic: string) => boolean;
export declare const mnemonicToSeedHex: (mnemonic: string, password?: string, blockchain?: Blockchain) => string;
export declare const generateMnemonic: (length: 12 | 24, lang?: string) => string;
export declare const getIndexes: (skip: number, limit: number) => number[];
export declare const preparePath: (path: string) => string;
export declare const getHardenedPath: (path: string) => string;
export declare const base58: baseX.BaseConverter;
export declare const sha256: (payload: any) => Buffer;
