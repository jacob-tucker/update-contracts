const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { SHA3 } = require("sha3");
var EC = require('elliptic').ec;
// var ec = new EC('secp256k1');
var ec = new EC('p256');

fcl.config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")

// CHANGE THESE THINGS FOR YOU
const PRIVATE_KEY = "299abca9c3ca90e57fa1f18c419a85dc7a661b6266525245623f0707abc29f10";
const ADDRESS = "0x15a90b2b88e0db6f";
const KEY_ID = 0;
const CONTRACT_NAME = "HelloWorld";

const sign = (message) => {
  const key = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, "hex"))
  const sig = key.sign(hash(message)) // hashMsgHex -> hash
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

const hash = (message) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}

async function authorizationFunction(account) {
  return {
    ...account,
    tempId: `${ADDRESS}-${KEY_ID}`,
    addr: fcl.sansPrefix(ADDRESS),
    keyId: Number(KEY_ID),
    signingFunction: async (signable) => {
      return {
        addr: fcl.withPrefix(ADDRESS),
        keyId: Number(KEY_ID),
        signature: sign(signable.message)
      }
    }
  }
}

async function performUpdate() {
  const newCode = `
  pub contract HelloWorld {
    pub var greeting: String 
  
    pub fun changeGreeting(newGreeting: String) {
      self.greeting = newGreeting
    }
  
    pub fun logA() {
      log("A")
    }

    pub fun logB() {
      log("B")
    }
  
    init() {
      self.greeting = "Hello, World!"
    }
  }
  `

  const transactionId = await fcl.mutate({
    cadence: `
    transaction(name: String, cadence: String) {
      prepare(signer: AuthAccount) {
        let code = cadence.utf8
        signer.contracts.update__experimental(name: name, code: code)
      }
    }
    `,
    args: (arg, t) => [
      arg(CONTRACT_NAME, t.String),
      arg(newCode, t.String)
    ],
    payer: authorizationFunction,
    proposer: authorizationFunction,
    authorizations: [authorizationFunction],
    limit: 999
  });

  console.log({transactionId});
  fcl.tx(transactionId).subscribe(res => {
    console.log(res);
  })
}

performUpdate();