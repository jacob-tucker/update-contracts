# Using Flow CLI

1. Install Flow CLI: https://docs.onflow.org/flow-cli/install/#gatsby-focus-wrapper
2. Change your private key and address in flow.json under "testnet-account" object (you can change it to "mainnet-account" for mainnet)
3. If your account uses ECDSA_secp256k1, change "signatureAlgorithm" to "ECDSA_secp256k1"
4. In a terminal, run `flow accounts update-contract CONTRACT_NAME PATH_TO_CONTRACT --network=testnet --signer=testnet-account` (or `--network=mainnet --signer=mainnet-account` for mainnet)

# Using FCL

1. Look at main.js for all the source code
2. Change `PRIVATE_KEY`, `ADDRESS`, `KEY_ID`, and `CONTRACT_NAME` to yours
3. If your account uses ECDSA_secp256k1, comment out line 6 in main.js and uncomment line 5
4. Put your new contract code on line 49
5. If you're using mainnet, change `"https://rest-testnet.onflow.org"` on line 9 to `"https://rest-mainnet.onflow.org"`
6. In a termimal, run `node main.js`