/* global artifacts, contract, assert, web3 */
var Splitter = artifacts.require('Splitter.sol')

contract('Splitter', accounts => {
  it('should be deployed with owner == accounts[0]', async () => {
    const splitter = await Splitter.deployed()
    const owner = await splitter.owner.call()
    assert.equal(owner, accounts[0], "Contract wasn't deployed correctly")
  })

  it('fails due to zero amount', async () => {
    const splitter = await Splitter.new()
    try {
      await splitter.pay(accounts[1], accounts[2], { from: accounts[0], value: 0 })
    } catch (e) {
      if (e.message.indexOf('revert') > -1) {
        return
      } else {
        assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
      }
    }
    assert.fail(null, null, 'Expected exception not received')
  })

  it('fails due to non-unique participant addresses', async () => {
    const splitter = await Splitter.new()
    try {
      await splitter.pay(accounts[1], accounts[2], { from: accounts[1], value: web3.toWei(0.2, 'ether') })
    } catch (e) {
      if (e.message.indexOf('revert') > -1) {
        return
      } else {
        assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
      }
    }
    assert.fail(null, null, 'Expected exception not received')
  })

  it('should return status 0x01 when payment is successful', async () => {
    const splitter = await Splitter.new()
    const tx = await splitter.pay(accounts[1], accounts[2], { from: accounts[0], value: web3.toWei(0.2, 'ether') })
    assert.equal(parseInt(tx.receipt.status, 16), 1, 'Payment failed')
  })

  it('splits 0.2 ether and pays 0.1 ether to account accounts[2]', async () => {
    const splitter = await Splitter.new()
    const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[2]), 'ether')
    await splitter.pay(accounts[1], accounts[2], { from: accounts[0], value: web3.toWei(0.2, 'ether') })
    const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[2]), 'ether')
    assert.equal(precisionRound(newBalance - initialBalance, 1), 0.1, 'Incorrect amount transfered')
  })

  it('splits 1.5 ether and pays 0.75 ether to account accounts[1]', async () => {
    const splitter = await Splitter.new()
    const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
    await splitter.pay(accounts[1], accounts[2], { from: accounts[0], value: web3.toWei(1.5, 'ether') })
    const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
    assert.equal(precisionRound(newBalance - initialBalance, 2), 0.75, 'Incorrect amount transfered')
  })
})

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}