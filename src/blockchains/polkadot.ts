import { BitcoinBase } from './bitcoin-base'
import {
    Blockchain,
    KeysWithPath,
    MasterKeys,
    Network,
    PathCursor,
    SeedWithKeys,
    TransactionJson,
    TransactionMethod,
} from '../types'
import { polkadot } from '../network-configs'
import { Keyring } from '@polkadot/keyring'
import { u8aToHex, hexToU8a, isHex, stringToU8a } from '@polkadot/util'
import {
    decodeAddress,
    encodeAddress,
    mnemonicToMiniSecret,
    cryptoWaitReady,
} from '@polkadot/util-crypto'
import { getIndexes, preparePath } from '../utils'
import { KeyringPair } from '@polkadot/keyring/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types/extrinsic'
import { ApiPromise, WsProvider } from '@polkadot/api'
export class Polkadot extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.DOT,
            network: Network.MAINNET,
            path: '//44//354//0',
            config: polkadot.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.DOT,
            network: Network.TESTNET,
            path: '//44//1//0',
            config: polkadot.testnet,
        },
    }
    private offlineApi: ApiPromise
    private readonly network: Network
    private readonly passphrase = 'restoreKeyRingPassphrase'

    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
        this.network = network
    }

    getPublicFromPrivate(privateKey: string, isWIF = true): string {
        const keyPair = this.getKeyring().createFromUri('//ANYPATH')
        keyPair.decodePkcs8(this.passphrase, hexToU8a(privateKey))
        return u8aToHex(keyPair.publicKey)
    }

    getAddressFromPublic(publicKey: string): string {
        return this.getKeyring().addFromAddress(publicKey).address
    }

    checkSign(publicKey: string, data: string, sign: string): boolean {
        return this.getKeyring()
            .addFromAddress(publicKey)
            .verify(data, stringToU8a(sign), publicKey)
    }

    async sign(data: string, privateKey: string, isTx): Promise<string> {
        await cryptoWaitReady()

        const privateKeyString: string = Object.values(
            JSON.parse(privateKey),
        )[0].toString()

        const keyPair = this.getKeyring().createFromUri('//ANYPATH')
        keyPair.decodePkcs8(this.passphrase, hexToU8a(privateKeyString))

        if (isTx) {
            const signable = JSON.parse(data)
            const tx = await this.createSubmittableExtrinsic(
                JSON.stringify(signable.tx),
            )
            const payload = this.offlineApi.createType('SignerPayload', {
                method: tx,
                ...signable.payload,
            })
            const { signature } = this.offlineApi
                .createType('ExtrinsicPayload', payload.toPayload(), {
                    version: signable.payload.version,
                })
                .sign(keyPair)
            return JSON.stringify({ ...signable, signature: signature })
        }
        return u8aToHex(keyPair.sign(data))
    }

    async getMasterFromSeed(
        seedPhrase: string,
        path?: string,
        password?: string,
    ): Promise<SeedWithKeys> {
        const seed = u8aToHex(mnemonicToMiniSecret(seedPhrase, password))
        const keys = await this.getMasterAddressFromSeed(seed, path)
        return {
            seedPhrase,
            seed,
            ...keys,
        }
    }

    async getMasterAddressFromSeed(
        seed: string,
        path?: string,
    ): Promise<MasterKeys> {
        await cryptoWaitReady()
        const masterPair = this.getKeyring().addFromUri(seed)
        const masterAccountPair = this.getKeyring().addFromUri(
            `${seed}${path || this.defaultPath}`,
        )

        return {
            masterPrivateKey: u8aToHex(masterPair.encodePkcs8(this.passphrase)),
            masterPublicKey: u8aToHex(masterPair.publicKey),
            masterAccountPrivateKey: u8aToHex(
                masterAccountPair.encodePkcs8(this.passphrase),
            ),
            masterAccountPublicKey: u8aToHex(masterAccountPair.publicKey),
        }
    }

    derivateFromPrivate(
        masterPrivateKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        const keyring = this.getKeyring()

        let isAccount = true
        let pair: KeyringPair

        if (masterPrivateKey.length === 66) {
            isAccount = false
            pair = keyring.addFromSeed(hexToU8a(masterPrivateKey))
        } else {
            pair = keyring.createFromUri('//ANYPATH')
            pair.decodePkcs8(this.passphrase, hexToU8a(masterPrivateKey))
        }

        const indexes = getIndexes(cursor.skip, cursor.limit)
        const path = preparePath(this.getPath(cursor.path || '0/0', isAccount))

        return indexes.map(index => {
            const currentPath = path.replace('{index}', index.toString())
            const derivedPair = pair.derive(currentPath)
            return {
                path: currentPath,
                address: derivedPair.address,
                publicKey: u8aToHex(derivedPair.publicKey),
                privateKey: u8aToHex(derivedPair.encodePkcs8(this.passphrase)),
            }
        })
    }

    getPath(path: string, isAccount: boolean): string {
        if (path.indexOf('m') !== -1) {
            if (isAccount) {
                throw new Error(
                    "invalid path or key\n use full path(m/44'/194'/0'/0/2) with master key\n use short path(0/2) with master account key",
                )
            }
            const lastIndex = path.lastIndexOf("'")
            path = path.slice(0, lastIndex) + path.slice(lastIndex + 1)
            return path.replace('m/', '//').replace(/'/g, '/')
        } else {
            if (isAccount) {
                return `/${path}`
            } else {
                return this.defaultPath + '/' + path
            }
        }
    }

    isValidAddress(address: string): boolean {
        try {
            encodeAddress(
                isHex(address) ? hexToU8a(address) : decodeAddress(address),
            )
            return true
        } catch (error) {
            return false
        }
    }

    async createSubmittableExtrinsic(
        txJson: string,
    ): Promise<SubmittableExtrinsic<'promise', ISubmittableResult>> {
        await cryptoWaitReady()

        const POLKA_ANY_API_ENDPOINT = 'ws://3.20.227.6:3020'
        try {
            this.offlineApi = await ApiPromise.create({
                provider: new WsProvider(POLKA_ANY_API_ENDPOINT),
            })
            await this.offlineApi.disconnect()
        } catch (e) {
            console.log(`createSubmittableExtrinsic error: ${e.message}`)
        }
        const tx: TransactionJson = JSON.parse(txJson)
        switch (tx.method) {
            case TransactionMethod.TRANSFER:
                return this.offlineApi.tx.balances.transfer(
                    tx.destination,
                    tx.amount,
                )
            case TransactionMethod.BOND:
                return this.offlineApi.tx.staking.bond(
                    tx.controller,
                    tx.amount,
                    tx.rewardsDestination,
                )
            case TransactionMethod.BOND_EXTRA_AMOUNT:
                return this.offlineApi.tx.staking.bondExtra(tx.amount)
            case TransactionMethod.UNBOND_AMOUNT:
                return this.offlineApi.tx.staking.unbond(tx.amount)
            case TransactionMethod.CHANGE_REWARDS_DESTINATION_ADDRESS:
                return this.offlineApi.tx.staking.setPayee(
                    tx.rewardsDestination,
                )
            case TransactionMethod.TRANSFER_KEEP_ALIVE:
                return this.offlineApi.tx.balances.transferKeepAlive(
                    tx.destination,
                    tx.amount,
                )
            case TransactionMethod.NOMINATE:
                return this.offlineApi.tx.staking.nominate(tx.validators)
            case TransactionMethod.WITHDRAW_UNBONDED:
                return this.offlineApi.tx.staking.withdrawUnbonded(
                    tx.numSlashingSpans,
                )
            default:
                return null
        }
    }

    getKeyring(): Keyring {
        const ss58Format = this.network === Network.MAINNET ? 0 : 42
        return new Keyring({ type: 'sr25519', ss58Format })
    }

    derivateFromPublic(
        masterPublicKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        throw new Error('Method not implemented for polkadot!')
    }
}
