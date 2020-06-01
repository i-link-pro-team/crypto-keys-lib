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
} from './keys.types'

import { generateMnemonic, validateMnemonic, mnemonicToSeedHex } from './utils'
import { Bitcoin } from './bitcoin'
import { BitcoinSV } from './bitcoinsv'
import { BitcoinCash } from './bitcoin-cash'
import { Litecoin } from './litecoin'
import { Ethereum } from './ethereum'
import { EOS } from './eos'
import { Ripple } from './ripple'

const blockchainLibs = {
    bitcoin: Bitcoin,
    litecoin: Litecoin,
    // eslint-disable-next-line @typescript-eslint/camelcase
    bitcoin_sv: BitcoinSV,
    // eslint-disable-next-line @typescript-eslint/camelcase
    bitcoin_cash: BitcoinCash,
    ethereum: Ethereum,
    eos: EOS,
    ripple: Ripple,
}

export class Keys implements IKeys {
    private lib
    constructor(blockchain: Blockchain, network: Network) {
        if (blockchainLibs[blockchain]) {
            this.lib = new blockchainLibs[blockchain](network)
        } else {
            throw new Error(`Blockchain ${blockchain} not implemented yet!`)
        }
    }

    private getMasterFromSeed(
        seedPhrase: string,
        path?: string,
        password?: string,
    ) {
        const seed = mnemonicToSeedHex(seedPhrase, password)
        const keys = this.lib.getMasterAddressFromSeed(seed, path)
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

    generateSeedPhrase(
        wordCount: 12 | 24,
        lang: SeedDictionaryLang = SeedDictionaryLang.ENGLISH,
        path?: string,
        password?: string,
    ): SeedWithKeys | Error {
        const seedPhrase = generateMnemonic(wordCount, lang)

        return this.getMasterFromSeed(seedPhrase, path, password)
    }

    getDataFromSeed(
        seedPhrase: string,
        path?: string,
        password?: string,
    ): SeedWithKeys | Error {
        return this.getMasterFromSeed(seedPhrase, path, password)
    }

    derivateKeys(
        from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
        pathCursor: PathCursor,
    ): KeysWithPath[] | Error {
        if (this.isSeed(from)) {
            const seedData = this.getMasterFromSeed(
                from.seedPhrase,
                from.password,
            )

            return this.lib.derivateFromPrivate(
                seedData.masterPrivateKey,
                pathCursor,
            )
        } else if (this.isMasterPrivate(from)) {
            return this.lib.derivateFromPrivate(
                from.masterPrivateKey,
                pathCursor,
            )
        } else {
            return this.lib.derivateFromPublic(from.masterPublicKey, pathCursor)
        }
    }

    sign(data: string, privateKey: PrivateKey): string | Error {
        return this.lib.sign(data, privateKey)
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
}
