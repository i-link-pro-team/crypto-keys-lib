import { SodiumPlus, CryptographyKey } from 'sodium-plus'
import createHash from 'create-hash'

import {
    IKeys,
    Blockchain,
    Network,
    SeedDictionaryLang,
    SeedWithKeys,
    FromSeedPhrase,
    FromMasterPublicKey,
    FromMasterPrivateKey,
    PathCursor,
    KeysWithPath,
    PrivateKey,
    PublicKey,
    Address,
    Path,
} from './types'

import { generateMnemonic, validateMnemonic, mnemonicToSeedHex } from './utils'
import { Bitcoin } from './blockchains/bitcoin'
import { Litecoin } from './blockchains/litecoin'
import { Dogecoin } from './blockchains/dogecoin'
import { Ethereum } from './blockchains/ethereum'
import { EOS } from './blockchains/eos'
import { Ripple } from './blockchains/ripple'
import { Dashcoin } from './blockchains/dashcoin'
import { Polkadot } from './blockchains/polkadot'
import { Binance } from './blockchains/binance'
import { Tron } from './blockchains/tron'

const blockchainLibs = {
    bitcoin: Bitcoin,
    litecoin: Litecoin,
    // eslint-disable-next-line @typescript-eslint/camelcase
    binance_smart_chain: Binance,
    ethereum: Ethereum,
    eos: EOS,
    ripple: Ripple,
    dogecoin: Dogecoin,
    dashcoin: Dashcoin,
    polkadot: Polkadot,
    tron: Tron,
}

export class Keys implements IKeys {
    private lib: any
    private blockchain: Blockchain
    constructor(blockchain: Blockchain, network: Network) {
        this.blockchain = blockchain
        if (blockchainLibs[blockchain]) {
            this.lib = new blockchainLibs[blockchain](network)
        } else {
            throw new Error(`Blockchain ${blockchain} not implemented yet!`)
        }
    }

    private async getMasterFromSeed(
        seedPhrase: string,
        path?: string,
        password?: string,
    ): Promise<SeedWithKeys> {
        const seed = mnemonicToSeedHex(seedPhrase, password, this.blockchain)
        const keys = await this.lib.getMasterAddressFromSeed(seed, path)
        return {
            seedPhrase,
            seed,
            ...keys,
        }
    }

    private isSeed(
        from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    ): from is FromSeedPhrase {
        return (from as FromSeedPhrase).seedPhrase !== undefined
    }

    private isMasterPrivate(
        from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    ): from is FromMasterPrivateKey {
        return (from as FromMasterPrivateKey).masterPrivateKey !== undefined
    }

    async generateSeedPhrase(
        wordCount: 12 | 24,
        lang: SeedDictionaryLang = SeedDictionaryLang.ENGLISH,
        path?: string,
        password?: string,
    ): Promise<SeedWithKeys | Error> {
        const seedPhrase = generateMnemonic(wordCount, lang)

        return this.getMasterFromSeed(seedPhrase, path, password)
    }

    async getDataFromSeed(
        seedPhrase: string,
        path?: string,
        password?: string,
    ): Promise<SeedWithKeys | Error> {
        return this.getMasterFromSeed(seedPhrase, path, password)
    }

    async derivateKeys(
        from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
        pathCursor: PathCursor,
    ): Promise<KeysWithPath[] | Error> {
        if (this.isSeed(from)) {
            const seedData = await this.getMasterFromSeed(
                from.seedPhrase,
                from.password,
            )
            // console.log(seedData)
            if (pathCursor.path && pathCursor.path.indexOf('m') !== -1) {
                console.log('From seed from full path')
                // if full path use master key
                return this.lib.derivateFromPrivate(
                    seedData.masterPrivateKey,
                    pathCursor,
                )
            } else {
                console.log('From seed from short path')
                // if short path use master account key
                return this.lib.derivateFromPrivate(
                    seedData.masterAccountPrivateKey,
                    pathCursor,
                )
            }
        } else if (this.isMasterPrivate(from)) {
            return this.lib.derivateFromPrivate(
                from.masterPrivateKey,
                pathCursor,
            )
        } else {
            return this.lib.derivateFromPublic(from.masterPublicKey, pathCursor)
        }
    }

    async sign(
        data: string,
        privateKey: PrivateKey,
        isTx = true,
        addMessagePrefix = true,
    ): Promise<string | Error> {
        return await this.lib.sign(data, privateKey, isTx, addMessagePrefix)
    }

    getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error {
        return this.lib.getPublicFromPrivate(privateKey)
    }

    getAddressFromPublic(
        publicKey: PublicKey,
        format?: string,
    ): Address | Error {
        return this.lib.getAddressFromPublic(publicKey, format)
    }

    checkSign(
        publicKey: PublicKey,
        data: string,
        sign: string,
    ): boolean | Error {
        return this.lib.checkSign(publicKey, data, sign)
    }

    checkSeedPhrase(seedPhrase: string): boolean | Error {
        return validateMnemonic(seedPhrase)
    }

    getDefaultPaths(): Path[] {
        return this.lib.getPaths()
    }

    isValidAddress(address: string, format?: string): boolean {
        return this.lib.isValidAddress(address, format)
    }

    getFormat(address: string): string {
        return this.lib.getFormat(address)
    }

    static async decrypt(
        encryptedData: string,
        password: string,
    ): Promise<string> {
        // Select a backend automatically
        const sodium = await SodiumPlus.auto()

        const hashedPassword = createHash('sha256')
            .update(password)
            .digest('hex')

        const key = CryptographyKey.from(hashedPassword, 'hex')

        const nonce = Buffer.from(encryptedData.substring(0, 48), 'hex')
        const ciphertext = Buffer.from(encryptedData.substring(48), 'hex')

        const decrypted = await sodium.crypto_secretbox_open(
            ciphertext,
            nonce,
            key,
        )

        return decrypted.toString('utf-8')
    }

    static async encrypt(data: string, password: string): Promise<string> {
        // Select a backend automatically
        const sodium = await SodiumPlus.auto()

        const hashedPassword = createHash('sha256')
            .update(password)
            .digest('hex')

        const key = CryptographyKey.from(hashedPassword, 'hex')

        const nonce = await sodium.randombytes_buf(24)

        const ciphertext = await sodium.crypto_secretbox(data, nonce, key)
        const encryptedData = nonce.toString('hex') + ciphertext.toString('hex')

        return encryptedData
    }
}
