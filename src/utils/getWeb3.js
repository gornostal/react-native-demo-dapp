import Web3 from 'web3'

var cachedWeb3 = null

const getWeb3 = () => {
  if (cachedWeb3) {
    return cachedWeb3
  }

  const provider = new Web3.providers.HttpProvider('http://192.168.88.244:8545')
  cachedWeb3 = new Web3(provider)

  return cachedWeb3
}

export default getWeb3
