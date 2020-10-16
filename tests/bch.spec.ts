/**
 * source: https://github.com/bitcoinjs/bitcoinjs-lib/
 */
import * as assert from 'assert'
import * as sinon from 'sinon'
import { after, before, describe, it } from 'mocha'
import { Keys } from '../src'
import { Blockchain, Network } from '../src'
import { BitcoinCash } from '../src/blockchains/bitcoin-cash'

describe('Lib/BitcoinCash', () => {
    const instance = new Keys(Blockchain.BITCOIN_CASH, Network.MAINNET)
    const instanceWithTestnet = new Keys(
        Blockchain.BITCOIN_CASH,
        Network.TESTNET,
    )

    describe('#getDataFromSeed/generateSeedPhrase', () => {
        const seed = instance.generateSeedPhrase(12)
        const actual = instance.getDataFromSeed(seed['seedPhrase'])
        it(`should be return \`${seed['seedPhrase']}\` seedPhrase`, () => {
            assert.strictEqual(actual['seedPhrase'], seed['seedPhrase'])
        })

        it(`should be return \`${seed['masterPublicKey']}\` masterPublicKey`, () => {
            assert.strictEqual(
                actual['masterPublicKey'],
                seed['masterPublicKey'],
            )
        })

        it(`should be return \`${seed['masterPrivateKey']}\ masterPrivateKey`, () => {
            assert.strictEqual(
                actual['masterPrivateKey'],
                seed['masterPrivateKey'],
            )
        })
    })

    describe('#getDefaultPaths', () => {
        const actualPaths = instance.getDefaultPaths()
        it('should return exact paths', () => {
            const expectedPaths = [
                {
                    blockchain: 'bitcoin_cash',
                    network: 'mainnet',
                    path: "m/44'/145'/0'/0/0",
                },
                {
                    blockchain: 'bitcoin_cash',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'oyster catch balcony fury end cotton soda quality collect maid artist essay'
        const actualPositive: boolean | Error = instance.checkSeedPhrase(
            seedPhrase,
        )
        it('should return `true`', () => {
            assert.strictEqual(actualPositive, true)
        })
        const actualNegative: boolean | Error = instance.checkSeedPhrase(
            'invalid',
        )
        it('should return `false`', () => {
            assert.strictEqual(actualNegative, false)
        })
    })

    describe('#derivateKeys', () => {
        context('with mainnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinCash.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p',
                    }
                    actual = instance.derivateKeys(masterPrivateKey, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/145'/0'/0/2",
                            address:
                                'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0',
                            publicKey:
                                '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467',
                            privateKey:
                                'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K2Hp25mLf4h83JiNCHdX8BwAZcSLiDZopCxZq6t59oZJHFfeGB9mv6kxMkg6C5nNLafSkyAqkQXcurfr1dVcnG4jio4SAK1p',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(BitcoinCash.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPublicKey = {
                        masterPublicKey:
                            'xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
                    }
                    actual = instance.derivateKeys(masterPublicKey, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        { path: string; address: string; publicKey: string },
                    ] = [
                        {
                            path: "m/44'/145'/0'/0/2",
                            address:
                                'bitcoincash:qqnpwxjq0unxnn4x9juejm0azswjddm9e5len205rx',
                            publicKey:
                                '03589ba6d047be9acf960f3a204be09f288245768db2de3dd62704fe24730b5ebf',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be call {derivateFromPublic} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPublic} function with following args 
              ['xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinCash.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const seedPhrase = {
                        seedPhrase:
                            'gossip that property quit spy emerge electric lazy twist couch phrase capable',
                    }
                    actual = instance.derivateKeys(seedPhrase, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/145'/0'/0/2",
                            address:
                                'bitcoincash:qz02e3r522fgts6n3u8g36yzfgs0grsclur3msdglj',
                            publicKey:
                                '03a64398508dd255a629073532be8d40dd2a2bc2c7ff6061281615b2ad637f9797',
                            privateKey:
                                'KxjbCqTzfHbUiXoLrjSH1JfWhFx2z6KJnLm2cfhgdt8kvoZhUnoU',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['xprv9zULchJqtEdnxDsvQqKkbatXtHqiDd5F5fvwR8a1teFSY85836oZwTexEMvFYqc9qkrCTJBuHwmui4XBvFTu7rLMnFBdfzKax83JAjf53uE',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9zULchJqtEdnxDsvQqKkbatXtHqiDd5F5fvwR8a1teFSY85836oZwTexEMvFYqc9qkrCTJBuHwmui4XBvFTu7rLMnFBdfzKax83JAjf53uE',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
        })

        context('with testnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinCash.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        masterPrivateKey,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address:
                                'bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr',
                            publicKey:
                                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                            privateKey:
                                'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(BitcoinCash.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPublicKey = {
                        masterPublicKey:
                            'tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        masterPublicKey,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        { path: string; address: string; publicKey: string },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address:
                                'bchtest:qzwq4c99qgmst0pc93kzanna0ucjmguaws0nj0ulps',
                            publicKey:
                                '02fb0142a7e11401073a01dc913f30755bfb082c6197347f146d42db6455eabd03',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be call {derivateFromPublic} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPublic} function with following args 
              ['tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinCash.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'include gas swallow valve dignity candy dragon voice member concert planet mutual dutch reform push',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        seedPhrase,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address:
                                'bchtest:qr80ql99kp3kvgrp5h5qu0pexm3ukug9ugthwn5a0k',
                            publicKey:
                                '02d7d7b4ed62a982c6bcdb8146230f9b92d4bd3a8136faaec49fbf8750261d82b7',
                            privateKey:
                                'cVeb1Z7ieVoU4a7KYPcKgwJsnqppsWujaesJs4Ughkt9mwkSLETq',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
          ['tprv8fpHND66YGHAydYhpYhW6wPWK3ujE9WukgrUUWTG2BhQoxEXz5jziPqroBCemW4ELqksHU9YHCyFGinsS2KGiNG2Rtxo19gYrtDsiYPXtTb',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8fpHND66YGHAydYhpYhW6wPWK3ujE9WukgrUUWTG2BhQoxEXz5jziPqroBCemW4ELqksHU9YHCyFGinsS2KGiNG2Rtxo19gYrtDsiYPXtTb',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
        })
    })

    describe('#derivateKeys/errorHandling', () => {
        const cursor = {
            skip: 1,
            limit: 1,
        }
        const masterPrivateKey = {
            masterPrivateKey:
                'xprv9s21ZrQH143K3HUKu4RWfCYy7K5ZvtvLqHvXpSxdF9Bwe7W3AD3hB3Yaj8AsLfvjNK3jfjsmnGnxDsedZCZmiTy9ngS6DiomecHwnEipEMy',
        }
        try {
            instance.derivateKeys({ masterPrivateKey: 'invalidKey' }, cursor) // check behavior in case of non-base58 charackter
        } catch (ex) {
            it('should be throw an error with following message `Non-base58 character`', () => {
                assert.strictEqual(ex.message, 'Non-base58 character')
            })
        }
        try {
            cursor.limit = -1
            instance.derivateKeys(masterPrivateKey, cursor) // check behavior in case of negative limit
        } catch (ex) {
            it('should be throw an error with following message `Limit must be greater than zero`', () => {
                assert.strictEqual(
                    ex.message,
                    'Limit must be greater than zero',
                )
            })
        }
    })

    describe('#sign', () => {
        it('signs', async () => {
            const transactionAsJSON =
                '{"sum":"0.00001","fee":"1000","inputs":[{"txId":"11c5db45d8aef91605795438554484458ae3bb1e19e0eab43d3f1cf79d01a23f","hex":"02000000017607db59718783281e620a8376fe23ca9d7dec9a4aa264ec195ba60cdab2198f000000006b48304502210083b260a6873296a5106aed58a7eb11605e3093c26dd974821b0dfd249d25fbad02203697063ad9b4419238b7595b68a6f58fd5ab853031bae4fee2ecc7452c3f9eaa4121033ee6aaf63904f06aaa811e568d6601867fb08438c5b5c01d01b1527e3367b782ffffffff027a4decd3010000001976a91497a808f1d39ae863ed78500504780e2ca0c21b7288ac40420f00000000001976a91417011c32363b905d799c77ed5d76624c0d70a35f88ac00000000","n":1,"value":"1000000","address":"bchtest:qqtsz8pjxcaeqhten3m76htkvfxq6u9rtukf0n7rc2","type":"pubkeyhash","scriptPubKeyHex":"76a91417011c32363b905d799c77ed5d76624c0d70a35f88ac"}],"outputs":[{"address":"bchtest:qpsphnjujdmf0mhrhmzv9pux8l3znwgrsc7yjxkvmr","amount":"1000"},{"address":"bchtest:qpq7qwv4ddrcu0x6y4cwtsv835yhkjma3v4rn00p3u","amount":"998000"}]}'
            const keysMap = JSON.stringify({
                'bchtest:qqtsz8pjxcaeqhten3m76htkvfxq6u9rtukf0n7rc2':
                    'cVXHeNoVjkBunVQUrYc4fkTLugWAnJqkh56DJAVLJ4Y9nRgFRF13',
            })
            const bch = new BitcoinCash(Network.TESTNET)
            const hash = await bch.sign(transactionAsJSON, keysMap)
            assert.strictEqual(
                hash,
                '02000000013fa2019df71c3f3db4eae0191ebbe38a458444553854790516f9aed845dbc511010000006b4830450221009f1d4e4156356536bec49d535613ac910fe21128b7b8c44fbf55928cba81bdab02205fc3a4d65a62f675e08a13da0e2e81d6d6a55a3fce50d719d8bd01ccac66b820412102e82e717b1866f8ed9f5546b8a10d95b34d15019cdb52211b0de4dff7b2ac463dffffffff02e8030000000000001976a914601bce5c937697eee3bec4c287863fe229b9038688ac703a0f00000000001976a91441e039956b478e3cda2570e5c1878d097b4b7d8b88ac00000000',
            )
        })

        // context('with mainnet network', async () => {
        //     const privateKey =
        //         'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc'
        //     const actual = await instance.sign('fake_data', privateKey, false)
        //     it('should be return `88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278`', () => {
        //         assert.strictEqual(
        //             actual,
        //             '88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278',
        //         )
        //     })
        //     try {
        //         await instance.sign('fake_data', 'Invalid_Private_Key', false) // check behavior in case of invalid private Key
        //     } catch (ex) {
        //         it('should be throw an error with following message `Non-base58 character`', () => {
        //             assert.strictEqual(ex.message, 'Non-base58 character')
        //         })
        //     }
        // })
        // context('with testnet network', async () => {
        //     const privateKey =
        //         'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw'
        //     const actual = await instanceWithTestnet.sign(
        //         'fake_data',
        //         privateKey,
        //         false,
        //     )
        //     it(`should be return 1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca`, () => {
        //         assert.strictEqual(
        //             actual,
        //             '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
        //         )
        //     })
        //     try {
        //         await instanceWithTestnet.sign(
        //             'fake_data',
        //             'Invalid_Private_Key',
        //             false,
        //         ) // check behavior in case of invalid private Key
        //     } catch (ex) {
        //         it('should be throw an error with following message `Non-base58 character`', () => {
        //             assert.strictEqual(ex.message, 'Non-base58 character')
        //         })
        //     }
        // })
    })

    describe('#getPublicFromPrivate', () => {
        context('with mainnet network', () => {
            const privateKey =
                'Kwk5LVAQBpckqhBnmiHTgYxvNKhZs3U1L9QAn7sbvSc8Ez1F1iPc'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return 037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467`, () => {
                assert.strictEqual(
                    actual,
                    '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467',
                )
            })
            try {
                instance.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
        context('with testnet network', () => {
            const privateKey =
                'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw'
            const actual = instanceWithTestnet.getPublicFromPrivate(privateKey)
            it(`should be return 02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d`, () => {
                assert.strictEqual(
                    actual,
                    '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                )
            })
            try {
                instanceWithTestnet.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
    })

    describe('#getAddressFromPublic', () => {
        const publicKey =
            '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467'
        describe('with mainnet network', () => {
            context('Without specifing format', () => {
                const actual = instance.getAddressFromPublic(publicKey)
                it(`should be return bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0`, () => {
                    assert.strictEqual(
                        actual,
                        'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0',
                    )
                })
                try {
                    instance.getAddressFromPublic('Invalid_Public_Key') // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected property "pubkey" of type ?isPoint, got Buffer',
                        )
                    })
                }
            })
            context('With bech32 format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0`, () => {
                    assert.strictEqual(
                        actual,
                        'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0',
                    )
                })
            })

            context('With invalid format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0`, () => {
                    assert.strictEqual(
                        actual,
                        'bitcoincash:qzyw2hnkpclxpkmhql7h4d07malamwe0ygnf32nka0',
                    )
                })
            })
        })

        describe('with testnet network', () => {
            const publicKey =
                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d'
            context('Without specifing format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                )
                it(`should be return bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr`, () => {
                    assert.strictEqual(
                        actual,
                        'bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr',
                    )
                })
                try {
                    instanceWithTestnet.getAddressFromPublic(
                        'Invalid_Public_Key',
                    ) // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected property "pubkey" of type ?isPoint, got Buffer',
                        )
                    })
                }
            })

            context('With bech32 format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr`, () => {
                    assert.strictEqual(
                        actual,
                        'bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr',
                    )
                })
            })

            context('With invalid format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr`, () => {
                    assert.strictEqual(
                        actual,
                        'bchtest:qqs2dtaw6pkjkrf2ypf8guprt7n3jsq9scjy3fjlwr',
                    )
                })
            })
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actual = instance.checkSign(
                '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467',
                'fake_data',
                '88f5749a9e8aa4f54988ad7924508061032fe612dabcc041bded2626c51594c51aa0f1c30834b339120cb925c2d7dee50eda7f9d281a922bc2c9f2f692fff278',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instance.checkSign(
                    '037969366e07cf26ca3aa3a2a5fadb39977531209812c6309c58213e54127de467',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expected Signature`', () => {
                    assert.strictEqual(ex.message, 'Expected Signature')
                })
            }
        })

        context('with testnet network', () => {
            const actualPositive = instanceWithTestnet.checkSign(
                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                'fake_data',
                '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actualPositive, true)
            })
            try {
                instanceWithTestnet.checkSign(
                    'Invalid_Public_Key',
                    'fake_data',
                    '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
                ) // check behavior in case of invalid public Key
            } catch (ex) {
                it('should be throw an error with following message `Expected isPoint, got Buffer`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected isPoint, got Buffer',
                    )
                })
            }
            try {
                instanceWithTestnet.checkSign(
                    '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expected Signature`', () => {
                    assert.strictEqual(ex.message, 'Expected Signature')
                })
            }
        })
    })
})
