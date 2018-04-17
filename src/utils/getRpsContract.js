import rpsContractJson from '../contracts/Rps.json'
import getWeb3 from './getWeb3'

var contractInstance = null

export class RpsContract {
  constructor(networkId, contractJson) {
    this.web3 = getWeb3()
    const contractAddress = contractJson.networks[networkId].address
    const RpsContract = this.web3.eth.contract(contractJson.abi)
    this.contract = RpsContract.at(contractAddress)
  }

  getGameStatus(gameName) {
    return new Promise((resolve, reject) => {
      this.contract.getGameStatus(gameName, (err, result) => {
        if (err) {
          return reject(err)
        }

        resolve(result.toNumber())
      })
    })
  }
}

/**
 * Returns a singleton instance
 */
const getRpsContract = () => {
  if (contractInstance) {
    return contractInstance
  }

  const networkId = 4 // rinkeby
  contractInstance = new RpsContract(networkId, rpsContractJson)
  return contractInstance
}

export default getRpsContract
