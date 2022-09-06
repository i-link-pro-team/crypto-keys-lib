import { BIP32Interface } from 'bip32'
import * as ethUtil from 'ethereumjs-util'
import {
    FeeMarketEIP1559Transaction,
    FeeMarketEIP1559TxData,
    Transaction,
    TxData,
} from '@ethereumjs/tx'
import Common, { Chain, Hardfork } from '@ethereumjs/common'

import { Blockchain, Network } from '../types'
import { BitcoinBase } from './bitcoin-base'
import { bitcoin } from '../network-configs'

export class Ethereum extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.ETH,
            network: Network.MAINNET,
            path: "m/44'/60'/0'",
            config: bitcoin.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.ETH,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: bitcoin.testnet,
        },
    }
    protected net: Network

    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
        this.net = network
    }

    getPublicFromPrivate(privateKey: string): string {
        return ethUtil.addHexPrefix(
            super.getPublicFromPrivate(privateKey.replace('0x', ''), false),
        )
    }

    getPrivateKey(privateKey: BIP32Interface): string {
        if (privateKey.privateKey) {
            return ethUtil.bufferToHex(privateKey.privateKey)
        } else {
            throw new Error('Invalid private key')
        }
    }

    getPublicKey(publicKey: string): string {
        return ethUtil.addHexPrefix(publicKey)
    }

    getAddressFromPublic(publicKey: string): string {
        const ethPubkey = ethUtil.importPublic(
            Buffer.from(publicKey.replace('0x', ''), 'hex'),
        )
        const addressBuffer = ethUtil.publicToAddress(ethPubkey)
        const hexAddress = ethUtil.addHexPrefix(addressBuffer.toString('hex'))
        const checksumAddress = ethUtil.toChecksumAddress(hexAddress)
        const address = ethUtil.addHexPrefix(checksumAddress)
        return address
    }

    async sign(
        data: string,
        privateKey: string,
        isTx = true,
        addMessagePrefix = true,
    ): Promise<string> {
        const [privateKeyString] = Object.values(
            JSON.parse(privateKey),
        ) as string[]

        if (isTx) {
            const chain =
                this.net === Network.MAINNET ? Chain.Mainnet : Chain.Ropsten
            const common = new Common({ chain, hardfork: Hardfork.London })
            const transaction: TxData & FeeMarketEIP1559TxData = JSON.parse(
                data,
            )
            const { gasPrice } = transaction
            const rawTransaction = gasPrice
                ? Transaction.fromTxData(transaction, { common })
                : FeeMarketEIP1559Transaction.fromTxData(transaction, {
                      common,
                  })
            const privateKeyBuffer = Buffer.from(
                privateKeyString.replace('0x', ''),
                'hex',
            )
            const signedTransaction = rawTransaction.sign(privateKeyBuffer)
            return `0x${signedTransaction.serialize().toString('hex')}`
        }

        const message = addMessagePrefix
            ? ethUtil.hashPersonalMessage(Buffer.from(data))
            : ethUtil.toBuffer(data)
        const sign = ethUtil.ecsign(message, ethUtil.toBuffer(privateKeyString))
        return JSON.stringify({
            r: sign.r.toString('hex'),
            s: sign.s.toString('hex'),
            v: sign.v,
        })
    }

    checkSign(_: string, __: string, sign: string): boolean {
        const signObject = JSON.parse(sign)

        return ethUtil.isValidSignature(
            parseInt(signObject.v),
            Buffer.from(signObject.r, 'hex'),
            Buffer.from(signObject.s, 'hex'),
        )
    }

    isValidAddress(address: string): boolean {
        return ethUtil.isValidAddress(address)
    }
}
