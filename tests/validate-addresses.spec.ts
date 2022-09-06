import { Bitcoin } from '../src/blockchains/bitcoin'
import { Network, Blockchain } from '../src/types'
import { Keys } from '../src/lib'
import { Ethereum } from '../src/blockchains/ethereum'
import { Litecoin } from '../src/blockchains/litecoin'
import { Ripple } from '../src/blockchains/ripple'
import { EOS } from '../src/blockchains/eos'
import { describe, it } from 'mocha'
import * as assert from 'assert'
import { BitcoinBase } from '../src/blockchains/bitcoin-base'

const generateAddress = async (
    network: Network,
    blockchain: Blockchain,
    testCallback: (publicKey: string) => void,
) => {
    const keys = new Keys(blockchain, network)
    const seed = await keys.generateSeedPhrase(12)

    if (seed && !(seed instanceof Error)) {
        const dkeys = await keys.derivateKeys(
            { masterPublicKey: seed.masterPublicKey },
            { skip: 0, limit: 1, path: "m/44'/0'/0'/0/3" },
        )

        for (const key in dkeys) {
            testCallback(dkeys[key]['publicKey'])
        }
    }
}

describe('Bitcoin Address Validator', () => {
    describe('Bitcoin MAINNET', () => {
        generateAddress(Network.MAINNET, Blockchain.BTC, publicKey => {
            const instance = new Bitcoin(Network.MAINNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('Bitcoin TESTNET', () => {
        generateAddress(Network.TESTNET, Blockchain.BTC, publicKey => {
            const instance = new Bitcoin(Network.TESTNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('ETHEREUM Address Validator', () => {
    describe('ETHEREUM MAINNET', () => {
        generateAddress(Network.MAINNET, Blockchain.ETH, publicKey => {
            const instance = new Ethereum(Network.MAINNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('ETHEREUM TESTNET', () => {
        generateAddress(Network.TESTNET, Blockchain.ETH, publicKey => {
            const instance = new Ethereum(Network.TESTNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('EOS Address Validator', () => {
    const generateEOS = (length = 12, prefix = 'e.') => {
        let text = ''
        const len = length - prefix.length
        const possible = 'abcdefghijklmnopqrstuvwxyz12345'

        for (let i = 0; i < len; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return prefix + text
    }

    describe('EOS MAINNET', () => {
        generateAddress(Network.MAINNET, Blockchain.EOS, (/* publicKey */) => {
            const instance = new EOS(Network.MAINNET)
            const address = generateEOS() /* instance.getAddressFromPublic(publicKey) */

            it('Should generate valid address: ' + address, () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('EOS TESTNET', () => {
        generateAddress(Network.TESTNET, Blockchain.EOS, (/* publicKey */) => {
            const instance = new EOS(Network.TESTNET)
            const address = generateEOS() /* instance.getAddressFromPublic(publicKey) */

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('LITECOIN Address Validator', () => {
    describe('LITECOIN MAINNET', () => {
        generateAddress(Network.MAINNET, Blockchain.LTC, publicKey => {
            const instance = new Litecoin(Network.MAINNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('LITECOIN TESTNET', () => {
        generateAddress(Network.TESTNET, Blockchain.LTC, publicKey => {
            const instance = new Litecoin(Network.TESTNET)
            const address = instance.getAddressFromPublic(publicKey)

            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('RIPPLE Address Validator', () => {
    ;['base58', 'bech32'].forEach(format => {
        describe('RIPPLE MAINNET', () => {
            generateAddress(Network.MAINNET, Blockchain.XRP, publicKey => {
                const instance = new Ripple(Network.MAINNET)
                const address = instance.getAddressFromPublic(publicKey, format)

                it(`Should generate valid ${format} address`, () => {
                    assert.equal(instance.isValidAddress(address), true)
                })
            })
        })

        describe('RIPPLE TESTNET', () => {
            generateAddress(Network.TESTNET, Blockchain.XRP, publicKey => {
                const instance = new Ripple(Network.TESTNET)
                const address = instance.getAddressFromPublic(publicKey, format)

                it(`Should generate valid ${format} address`, () => {
                    assert.equal(instance.isValidAddress(address), true)
                })
            })
        })
    })
})

describe('getFormat', () => {
    generateAddress(Network.MAINNET, Blockchain.BTC, publicKey => {
        it("Should return 'base58' format for base58 addresses", () => {
            const instance = new Bitcoin(Network.MAINNET)
            const address = instance.getAddressFromPublic(publicKey)

            assert.equal(instance.getFormat(address), 'base58')
        })
    })

    generateAddress(Network.MAINNET, Blockchain.XRP, publicKey => {
        it("Should return 'base58' format for base58 addresses", () => {
            const instance = new BitcoinBase(Network.MAINNET)
            const address = instance.getAddressFromPublic(publicKey, 'base58')

            assert.strictEqual(instance.getFormat(address), 'base58')
        })
    })

    it("Should throw 'Invalid address' error", () => {
        const address = 'bc1qz5f8d6qejxtdg4y5p3zarvary0x5xw7kV8f3t4'
        const instance = new BitcoinBase(Network.MAINNET)

        assert.throws(
            () => instance.getFormat(address),
            new Error('Invalid address'),
        )
    })
})

describe('Invalid Addresses', () => {
    const instance = new Bitcoin(Network.MAINNET)
    const addresses = [
        'tprv8ZgxMBicQKsPcsbCVeqqF1KVdH7gwDJbxbzpCxDUsoXHdb6SnTPY',
        '98ZJLNGbhd2pq7ZtDiPYTfJ7iBenLVQpYgSQqPjUsQeJXH8VQ8xA67D',
    ]
    it("Should return 'false' for invalid addresses", () => {
        addresses.forEach(address => {
            assert.equal(instance.isValidAddress(address), false)
        })
    })
})
