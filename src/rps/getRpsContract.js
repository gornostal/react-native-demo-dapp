import { promisify } from 'es6-promisify'

import rpsContractJson from '../contracts/Rps.json'
import { getUport } from '../uport/uportApi'

var contractInstance = null

export class RpsContract {
  constructor(networkId, contractJson) {
    this.contractAddress = contractJson.networks[networkId].address
    this.contractAbi = contractJson.abi
    this.contract = getUport().getContractInstance(this.contractAbi, this.contractAddress)
  }

  getGameStatus(gameName) {
    return promisify(this.contract.getGameStatus.bind(this.contract))(gameName)
  }

  getBetValue(gameName) {
    return promisify(this.contract.getBetValue.bind(this.contract))(gameName)
  }

  async startGame(gameName, hash, betWei) {
    const txHash = await promisify(this.contract.startGame.bind(this.contract))(gameName, hash, { value: betWei })
    return await this._waitForMinedTransaction(txHash)
  }

  async _getTransactionReceipt(txHash) {
    const eth = getUport().web3.eth
    return await promisify(eth.getTransactionReceipt.bind(eth))(txHash)
  }

  /**
   * Calls getTransactionReceipt() every 1s until it gets mined
   */
  async _waitForMinedTransaction(txHash, timeout = 60) {
    const timeoutTime = Date.now() + timeout * 1000
    while (Date.now() < timeoutTime) {
      const tx = await this._getTransactionReceipt(txHash)
      if (tx) {
        return tx
      } else {
        await sleep(5000)
        console.log('retrying', txHash)
      }
    }
    throw new Error('Timeout reached while waiting for a transaction to be mined')
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

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

export default getRpsContract
