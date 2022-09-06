import { BitcoinBase } from './bitcoin-base'
import { Blockchain, KeysWithPath, Network, PathCursor } from '../types'
import { tron } from '../network-configs'
import * as bip32 from 'bip32'
import { getHardenedPath, getIndexes, preparePath } from '../utils'
import { ec as EC } from 'elliptic'
import { utils } from 'ethers'

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const ALPHABET_MAP = {}

for (let i = 0; i < ALPHABET.length; i++) ALPHABET_MAP[ALPHABET.charAt(i)] = i

const BASE = 58
const ADDRESS_SIZE = 34
const ADDRESS_PREFIX = '41'
const ADDRESS_PREFIX_BYTE = 0x41

export class Tron extends BitcoinBase {
    protected networks = {
        [Network.MAINNET]: {
            blockchain: Blockchain.TRX,
            network: Network.MAINNET,
            path: "m/44'/195'/0'",
            config: tron.mainnet,
        },
        [Network.TESTNET]: {
            blockchain: Blockchain.TRX,
            network: Network.TESTNET,
            path: "m/44'/1'/0'",
            config: tron.testnet,
        },
    }
    protected net: Network

    constructor(network: Network) {
        super(network)
        this.networkConfig = this.networks[network].config
        this.defaultPath = this.networks[network].path
        this.net = network
    }

    async sign(data: string, privateKey: string, isTx = true): Promise<string> {
        if (isTx) {
            const privateKeyString: string = Object.values(
                JSON.parse(privateKey),
            )[0].toString()
            const transaction = JSON.parse(data)
            const privateKeyBytes = this.hexStr2byteArray(privateKeyString)

            const txID = transaction.txID
            const signature = this.ECKeySign(
                this.hexStr2byteArray(txID),
                privateKeyBytes,
            )

            if (Array.isArray(transaction.signature)) {
                if (!transaction.signature.includes(signature))
                    transaction.signature.push(signature)
            } else transaction.signature = [signature]

            return JSON.stringify(transaction)
        }

        const privateKeyBytes = this.hexStr2byteArray(privateKey)
        const bytes = this.stringToBytes(data)
        const hashBytes = this.SHA256(bytes)
        const signedBytes = this.ECKeySign(hashBytes, privateKeyBytes)
        const signedString = this.bytesToString(signedBytes)

        return signedString
    }

    ECKeySign(hashBytes, priKeyBytes) {
        const ec = new EC('secp256k1')
        const key = ec.keyFromPrivate(priKeyBytes, 'bytes')
        const signature = key.sign(hashBytes)
        const r = signature.r
        const s = signature.s
        const id = signature.recoveryParam

        let rHex = r.toString('hex')

        while (rHex.length < 64) {
            rHex = `0${rHex}`
        }

        let sHex = s.toString('hex')

        while (sHex.length < 64) {
            sHex = `0${sHex}`
        }

        const idHex = this.byte2hexStr(id)
        const signHex = rHex + sHex + idHex

        return signHex
    }

    protected getPrivateKey(privateKey: bip32.BIP32Interface): string {
        return privateKey.privateKey.toString('hex')
    }

    derivateFromPrivate(
        masterPrivateKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        const wallet = bip32.fromBase58(masterPrivateKey, this.networkConfig)

        let isAccount = false
        if (wallet.parentFingerprint) {
            isAccount = true
        }

        const indexes = getIndexes(cursor.skip, cursor.limit)
        const path = preparePath(this.getPath(cursor.path || '0/0', isAccount))

        return indexes.map(index => {
            const currentPath = path.replace('{index}', index.toString())
            const derived = wallet.derivePath(currentPath)
            const publicKey = this.getPubKeyFromPriKey(derived.privateKey)
            const address = this.computeAddress(
                this.hexStr2byteArray(publicKey),
            )

            return {
                path: this.getPath(currentPath, false),
                address: this.getBase58CheckAddress(address),
                publicKey,
                privateKey: this.getPrivateKey(derived),
            }
        })
    }

    derivateFromPublic(
        masterPublicKey: string,
        cursor: PathCursor,
    ): KeysWithPath[] {
        const wallet = bip32.fromBase58(masterPublicKey, this.networkConfig)

        let isAccount = false
        if (wallet.parentFingerprint) {
            isAccount = true
        }

        const indexes = getIndexes(cursor.skip, cursor.limit)
        const path = preparePath(this.getPath(cursor.path || '0/0', isAccount))

        return indexes.map(index => {
            const currentPath = path.replace('{index}', index.toString())
            const pathParts = currentPath
                .replace(getHardenedPath(path), '')
                .split('/')
                .filter(part => part)
                .map(part => parseInt(part))

            const derived = this.deriveRecursive(wallet, pathParts)
            const publicKey = this.getTronPubKeyFromPubKey(derived.publicKey)
            const address = this.computeAddress(
                this.hexStr2byteArray(publicKey),
            )

            return {
                path: this.getPath(currentPath, false),
                address: this.getBase58CheckAddress(address),
                publicKey,
            }
        })
    }

    getPublicFromPrivate(privateKey: string, isWIF = true): string {
        const privateKeyBytes = this.hexStr2byteArray(privateKey)
        return this.getPubKeyFromPriKey(privateKeyBytes)
    }

    getAddressFromPublic(publicKey: string): string {
        const addressBytes = this.computeAddress(
            this.hexStr2byteArray(publicKey),
        )
        const address = this.getBase58CheckAddress(addressBytes)

        return address
    }

    computeAddress(pubBytes) {
        if (pubBytes.length === 65) pubBytes = pubBytes.slice(1)

        const hash = utils
            .keccak256(pubBytes)
            .toString()
            .substring(2)
        const addressHex = ADDRESS_PREFIX + hash.substring(24)

        return this.hexStr2byteArray(addressHex)
    }

    getTronPubKeyFromPubKey(PubKeyBytes): string {
        const ec = new EC('secp256k1')
        const key = ec.keyFromPublic(PubKeyBytes, 'bytes')
        const pubkey = key.getPublic()
        const x = pubkey.x
        const y = pubkey.y

        let xHex = x.toString('hex')

        while (xHex.length < 64) {
            xHex = `0${xHex}`
        }

        let yHex = y.toString('hex')

        while (yHex.length < 64) {
            yHex = `0${yHex}`
        }

        const pubkeyHex = `04${xHex}${yHex}`

        return pubkeyHex
    }

    isValidAddress(base58Str) {
        if (typeof base58Str !== 'string') return false

        if (base58Str.length !== ADDRESS_SIZE) return false

        let address = this.decode58(base58Str)

        if (address.length !== 25) return false

        if (address[0] !== ADDRESS_PREFIX_BYTE) return false

        const checkSum = address.slice(21)
        address = address.slice(0, 21)

        const hash0 = this.SHA256(address)
        const hash1 = this.SHA256(hash0)
        const checkSum1 = hash1.slice(0, 4)

        if (
            checkSum[0] == checkSum1[0] &&
            checkSum[1] == checkSum1[1] &&
            checkSum[2] == checkSum1[2] &&
            checkSum[3] == checkSum1[3]
        ) {
            return true
        }

        return false
    }

    getPubKeyFromPriKey(priKeyBytes): string {
        const ec = new EC('secp256k1')
        const key = ec.keyFromPrivate(priKeyBytes, 'bytes')
        const pubkey = key.getPublic()
        const x = pubkey.x
        const y = pubkey.y

        let xHex = x.toString('hex')

        while (xHex.length < 64) {
            xHex = `0${xHex}`
        }

        let yHex = y.toString('hex')

        while (yHex.length < 64) {
            yHex = `0${yHex}`
        }

        const pubkeyHex = `04${xHex}${yHex}`

        return pubkeyHex
    }

    decode58(string) {
        if (string.length === 0) return []

        let i
        let j

        const bytes = [0]

        for (i = 0; i < string.length; i++) {
            const c = string[i]

            if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

            for (j = 0; j < bytes.length; j++) bytes[j] *= BASE

            bytes[0] += ALPHABET_MAP[c]
            let carry = 0

            for (j = 0; j < bytes.length; ++j) {
                bytes[j] += carry
                carry = bytes[j] >> 8
                bytes[j] &= 0xff
            }

            while (carry) {
                bytes.push(carry & 0xff)
                carry >>= 8
            }
        }

        for (i = 0; string[i] === '1' && i < string.length - 1; i++)
            bytes.push(0)

        return bytes.reverse()
    }

    encode58(buffer) {
        if (buffer.length === 0) return ''

        let i
        let j

        const digits = [0]

        for (i = 0; i < buffer.length; i++) {
            for (j = 0; j < digits.length; j++) digits[j] <<= 8

            digits[0] += buffer[i]
            let carry = 0

            for (j = 0; j < digits.length; ++j) {
                digits[j] += carry
                carry = (digits[j] / BASE) | 0
                digits[j] %= BASE
            }

            while (carry) {
                digits.push(carry % BASE)
                carry = (carry / BASE) | 0
            }
        }

        for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++)
            digits.push(0)

        return digits
            .reverse()
            .map(digit => ALPHABET[digit])
            .join('')
    }

    SHA256(msgBytes) {
        const msgHex = this.byteArray2hexStr(msgBytes)
        const hashHex = utils.sha256('0x' + msgHex).replace(/^0x/, '')
        return this.hexStr2byteArray(hashHex)
    }

    byteArray2hexStr(byteArray) {
        let str = ''

        for (let i = 0; i < byteArray.length; i++)
            str += this.byte2hexStr(byteArray[i])

        return str
    }

    byte2hexStr(byte) {
        if (typeof byte !== 'number') throw new Error('Input must be a number')

        if (byte < 0 || byte > 255) throw new Error('Input must be a byte')

        const hexByteMap = '0123456789ABCDEF'

        let str = ''
        str += hexByteMap.charAt(byte >> 4)
        str += hexByteMap.charAt(byte & 0x0f)

        return str
    }

    getBase58CheckAddress(addressBytes) {
        const hash0 = this.SHA256(addressBytes)
        const hash1 = this.SHA256(hash0)

        let checkSum = hash1.slice(0, 4)
        checkSum = addressBytes.concat(checkSum)

        return this.encode58(checkSum)
    }

    hexStr2byteArray(str, strict = false) {
        if (typeof str !== 'string')
            throw new Error('The passed string is not a string')

        let len = str.length

        if (strict) {
            if (len % 2) {
                str = `0${str}`
                len++
            }
        }
        const byteArray = []
        let d = 0
        let j = 0
        let k = 0

        for (let i = 0; i < len; i++) {
            const c = str.charAt(i)

            if (this.isHexChar(c)) {
                d <<= 4
                d += this.hexChar2byte(c)
                j++

                if (0 === j % 2) {
                    byteArray[k++] = d
                    d = 0
                }
            } else
                throw new Error('The passed hex char is not a valid hex string')
        }

        return byteArray
    }

    isHexChar(c) {
        if (
            (c >= 'A' && c <= 'F') ||
            (c >= 'a' && c <= 'f') ||
            (c >= '0' && c <= '9')
        ) {
            return 1
        }

        return 0
    }

    hexChar2byte(c) {
        let d

        if (c >= 'A' && c <= 'F') d = c.charCodeAt(0) - 'A'.charCodeAt(0) + 10
        else if (c >= 'a' && c <= 'f')
            d = c.charCodeAt(0) - 'a'.charCodeAt(0) + 10
        else if (c >= '0' && c <= '9') d = c.charCodeAt(0) - '0'.charCodeAt(0)

        if (typeof d === 'number') return d
        else throw new Error('The passed hex char is not a valid hex char')
    }

    stringToBytes(str) {
        if (typeof str !== 'string')
            throw new Error('The passed string is not a string')

        const bytes = []
        let c

        for (let i = 0; i < str.length; i++) {
            c = str.charCodeAt(i)

            if (c >= 0x010000 && c <= 0x10ffff) {
                bytes.push(((c >> 18) & 0x07) | 0xf0)
                bytes.push(((c >> 12) & 0x3f) | 0x80)
                bytes.push(((c >> 6) & 0x3f) | 0x80)
                bytes.push((c & 0x3f) | 0x80)
            } else if (c >= 0x000800 && c <= 0x00ffff) {
                bytes.push(((c >> 12) & 0x0f) | 0xe0)
                bytes.push(((c >> 6) & 0x3f) | 0x80)
                bytes.push((c & 0x3f) | 0x80)
            } else if (c >= 0x000080 && c <= 0x0007ff) {
                bytes.push(((c >> 6) & 0x1f) | 0xc0)
                bytes.push((c & 0x3f) | 0x80)
            } else bytes.push(c & 0xff)
        }
        return bytes
    }

    bytesToString(arr) {
        if (typeof arr === 'string') return arr

        let str = ''

        for (let i = 0; i < arr.length; i++) {
            const one = arr[i].toString(2)
            const v = one.match(/^1+?(?=0)/)

            if (v && one.length === 8) {
                const bytesLength = v[0].length
                let store = arr[i].toString(2).slice(7 - bytesLength)

                for (let st = 1; st < bytesLength; st++)
                    store += arr[st + i].toString(2).slice(2)

                str += String.fromCharCode(parseInt(store, 2))
                i += bytesLength - 1
            } else {
                str += String.fromCharCode(arr[i])
            }
        }

        return str
    }
}
