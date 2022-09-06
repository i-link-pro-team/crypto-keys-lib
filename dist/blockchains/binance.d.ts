import { Ethereum } from './ethereum';
export declare class Binance extends Ethereum {
    sign(data: string, privateKey: string, isTx?: boolean): Promise<string>;
}
