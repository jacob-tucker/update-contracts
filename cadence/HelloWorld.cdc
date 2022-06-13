pub contract HelloWorld {
  pub var greeting: String 

  pub fun changeGreeting(newGreeting: String) {
    self.greeting = newGreeting
  }

  pub fun logA() {
    log("A")
  }

  init() {
    self.greeting = "Hello, World!"
  }
}