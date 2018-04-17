import Web3 from 'web3'

var cachedWeb3 = null

const getWeb3 = () => {
  if (cachedWeb3) {
    return cachedWeb3
  }

  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/8A9p9cVJZyAUqYODl5Fq')
  cachedWeb3 = new Web3(provider)

  return cachedWeb3
}

export default getWeb3
