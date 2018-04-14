import contract from 'truffle-contract'

import RpsContract from '../contracts/Rps.json'
import getWeb3 from './getWeb3'

const getRpsContract = async () => {
  const rps = contract(RpsContract)
  const web3 = getWeb3()
  rps.setProvider(web3.currentProvider)

  // dirty hack for web3@1.0.0 support for localhost testrpc,
  // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
  if (typeof rps.currentProvider.sendAsync !== 'function') {
    rps.currentProvider.sendAsync = function() {
      return rps.currentProvider.send.apply(rps.currentProvider, arguments)
    }
  }

  return await rps.deployed()
}

export default getRpsContract
