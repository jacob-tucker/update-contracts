transaction(name: String, cadence: String) {
  prepare(signer: AuthAccount) {
    let code = cadence.utf8
    signer.contracts.update__experimental(name: name, code: code)
  }
}