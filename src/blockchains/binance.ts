import { Ethereum } from './ethereum'
import { Network } from '../types'
import Common from 'ethereumjs-common'
import { Transaction as ethTx } from 'ethereumjs-tx'
import * as ethUtil from 'ethereumjs-util'

export class Binance extends Ethereum {
    async sign(data: string, privateKey: string, isTx = true): Promise<string> {
        if (isTx) {
            const privateKeyString: string = Object.values(
                JSON.parse(privateKey),
            )[0].toString()

            let baseChain = 'mainnet'
            let chainId = 56
            let hardfork = 'london'

            if (this.net === Network.TESTNET) {
                baseChain = 'ropsten'
                chainId = 97
                hardfork = 'petersburg'
            }

            const transactionObject = JSON.parse(data)
            const common = Common.forCustomChain(
                baseChain,
                {
                    networkId: chainId,
                    chainId,
                },
                hardfork,
            )

            const txRaw = new ethTx(transactionObject, { common })
            const pk = Buffer.from(privateKeyString.replace('0x', ''), 'hex')
            txRaw.sign(pk)
            return `0x${txRaw.serialize().toString('hex')}`
        }

        const hash = ethUtil.hashPersonalMessage(Buffer.from(data))
        const sign = ethUtil.ecsign(
            hash,
            Buffer.from(privateKey.replace('0x', ''), 'hex'),
        )
        return JSON.stringify({
            r: sign.r.toString('hex'),
            s: sign.s.toString('hex'),
            v: sign.v,
        })
    }
}
