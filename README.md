![Logo](https://i.postimg.cc/Qxt01Pq2/167322528-4602761833073521-2811105515199118326-n-1.png)

# Crypto keys lib

features:
- generate seed phrase
- derivate keys
- sign
- verify sign and address
- safe encrypt and decrypt with sodium 

blockchains:
 - Bitcoin
 - Litecoin
 - Dogecoin
 - Ethereum
 - EOS
 - Ripple
 - Dashcoin
 - Polkadot

# Use example
```
import { Keys, Blockchain, Network } from "crypto-api-keys-lib";

const k = new Keys(Blockchain.BITCOIN, Network.MAINNET);

console.log(k.generateSeedPhrase(12));
```

# Encryption example
```
import { Keys } from "crypto-api-keys-lib";

const encTest = async () => {
    const password = '123'
    const encrypted = await Keys.encrypt('encrypt test', password)
    const decrypted = await Keys.decrypt(encrypted, password)
    console.log({ encrypted, decrypted })
}

encTest()
```

# Derivation example
```
import { Keys, Blockchain, Network } from "crypto-api-keys-lib";

const check = async () => {
    for (const key of Object.keys(Blockchain)) {
        const keys = new Keys(Blockchain[key], Network.MAINNET)
        const seed = keys.generateSeedPhrase(12)

        // console.log({ seed })

        if (seed && !(seed instanceof Error)) {
            const dkeys = await keys.derivateKeys(
                { masterPrivateKey: seed.masterAccountPrivateKey },
                { skip: 0, limit: 1, path: '0/0' },
            )
            console.log({ key, dkeys })
        }
    }
}
check()
```
