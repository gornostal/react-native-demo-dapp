var HDWalletProvider = require('truffle-hdwallet-provider')
var mnemonic = 'maid couple squeeze blind neck dinner cross melt age woman seek property'

module.exports = {
  networks: {
    development: {
      // start with ./truffle.sh develop
      host: '127.0.0.1',
      port: 9545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/8A9p9cVJZyAUqYODl5Fq')
      },
      gas: 4698712,
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/8A9p9cVJZyAUqYODl5Fq')
      },
      gas: 4698712,
      network_id: 4
    }
  }
}
