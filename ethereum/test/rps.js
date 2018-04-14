/* global artifacts, contract, assert, web3 */
const Rps = artifacts.require('Rps.sol')
const Web3 = require('web3')

const web3u = new Web3(web3.currentProvider)
const shapes = {
  rock: '0',
  paper: '1',
  scissors: '2'
}
const GameStatus = {
  notStarted: 0,
  choosing: 1,
  revealing: 2,
  player1Won: 3,
  player2Won: 4,
  tie: 5
}

function secretBytes(secret) {
  // get sha3 hash so the return value is 32 bytes long
  return web3u.utils.sha3(secret)
}

function gameName(name) {
  return web3u.utils.utf8ToHex(name)
}

function shapeHash(shape, secret) {
  return web3u.utils.soliditySha3({ t: 'uint8', v: shapes[shape] }, { t: 'bytes32', v: secretBytes(secret) })
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

contract('Rock Paper Scissors', accounts => {
  describe('Rps()', () => {
    it('should be deployed with owner == accounts[0]', async () => {
      const rps = await Rps.deployed()
      const owner = await rps.owner.call()
      assert.equal(owner, accounts[0], "Contract wasn't deployed correctly")
    })
  })

  describe('startGame()', () => {
    it('should start a game', async () => {
      const rps = await Rps.new()
      const veryLongSecret = Array(10000).join('a')
      const tx = await rps.startGame(gameName('newGame'), shapeHash('rock', veryLongSecret), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')
    })

    it('should fail if game already started', async () => {
      const rps = await Rps.new()
      async function startGame() {
        await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
          from: accounts[0],
          value: web3.toWei(0.1, 'ether')
        })
      }
      await startGame()
      try {
        await startGame()
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })

    it('should fail if no ether is transfered', async () => {
      const rps = await Rps.new()
      try {
        await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
          from: accounts[0],
          value: web3.toWei(0, 'ether')
        })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })
  })

  describe('getBetValue()', () => {
    it('should return bet value', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      const betValue = await rps.getBetValue(gameName('newGame'))
      assert.equal(betValue.toNumber(), web3.toWei(0.1, 'ether'))
    })
  })

  describe('joinGame()', () => {
    it('should send transaction successfully', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      const tx = await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret654'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')
    })

    it('should fail if game not started', async () => {
      const rps = await Rps.new()
      try {
        await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret654'), {
          from: accounts[1],
          value: web3.toWei(0.1, 'ether')
        })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })

    it("should fail if reward value doesn't match", async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      try {
        await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret654'), {
          from: accounts[1],
          value: web3.toWei(0.2, 'ether')
        })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })
  })

  describe('getGameStatus()', () => {
    it('should return GameStatus.notStarted', async () => {
      const rps = await Rps.new()
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result, GameStatus.notStarted)
    })

    it('should return GameStatus.choosing', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result, GameStatus.choosing)
    })

    it('should return GameStatus.revealing', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.revealing)
    })

    it('should return GameStatus.tie if shapes are the same', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('rock', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, web3u.utils.utf8ToHex('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, web3u.utils.utf8ToHex('secret234'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.tie)
    })

    it('should return GameStatus.tie if both gave an invalid hash', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, web3u.utils.utf8ToHex('abc'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, web3u.utils.utf8ToHex('xyz'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.tie)
    })

    it('should return GameStatus.player2Won if player1 gave an invalid hash', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('rock', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret234'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.player2Won)
    })

    it('should return GameStatus.player1Won if player2 gave an invalid hash', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('rock', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret234'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.player1Won)
    })

    it('should return GameStatus.player1Won if player1 won', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('rock', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, secretBytes('secret234'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.player1Won)
    })

    it('should return GameStatus.player2Won if player2 won', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('scissors', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret234'), {
        from: accounts[1]
      })
      const result = await rps.getGameStatus(gameName('newGame'))
      assert.equal(result.toNumber(), GameStatus.player2Won)
    })
  })

  describe('getReward()', () => {
    it('should fail if msg.sender did not participate in a game', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('scissors', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })

      try {
        await rps.getReward(gameName('newGame'), { from: accounts[2] })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })

    it('should send `reward * 2` Ether to player 1 if he wins', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('rock', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, secretBytes('secret234'), {
        from: accounts[1]
      })

      const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
      const tx = await rps.getReward(gameName('newGame'), { from: accounts[0] })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')

      const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
      assert.equal(precisionRound(newBalance - initialBalance, 1), 0.2, 'Incorrect amount transfered')
    })

    it("should send `reward` Ether to player 1 if it's a tie", async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret234'), {
        from: accounts[1]
      })

      const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
      const tx = await rps.getReward(gameName('newGame'), { from: accounts[0] })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')

      const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
      assert.equal(precisionRound(newBalance - initialBalance, 1), 0.1, 'Incorrect amount transfered')
    })

    it('should not allow multiple withdrawals for player 1', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('paper', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('paper', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.paper, secretBytes('secret234'), {
        from: accounts[1]
      })

      await rps.getReward(gameName('newGame'), { from: accounts[0] })

      try {
        await rps.getReward(gameName('newGame'), { from: accounts[0] })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })

    it('should send `reward * 2` Ether to player 2 if he wins', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('scissors', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('rock', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.rock, secretBytes('secret234'), {
        from: accounts[1]
      })

      const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
      const tx = await rps.getReward(gameName('newGame'), { from: accounts[1] })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')

      const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
      assert.equal(precisionRound(newBalance - initialBalance, 1), 0.2, 'Incorrect amount transfered')
    })

    it("should send `reward` Ether to player 2 if it's a tie", async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('scissors', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('scissors', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret234'), {
        from: accounts[1]
      })

      const initialBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
      const tx = await rps.getReward(gameName('newGame'), { from: accounts[1] })
      assert.equal(parseInt(tx.receipt.status, 16), 1, 'Transaction should succeed')

      const newBalance = web3.fromWei(await web3.eth.getBalance(accounts[1]), 'ether')
      assert.equal(precisionRound(newBalance - initialBalance, 1), 0.1, 'Incorrect amount transfered')
    })

    it('should not allow multiple withdrawals for player 2', async () => {
      const rps = await Rps.new()
      await rps.startGame(gameName('newGame'), shapeHash('scissors', 'secret123'), {
        from: accounts[0],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.joinGame(gameName('newGame'), shapeHash('scissors', 'secret234'), {
        from: accounts[1],
        value: web3.toWei(0.1, 'ether')
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret123'), {
        from: accounts[0]
      })
      await rps.revealSecret(gameName('newGame'), shapes.scissors, secretBytes('secret234'), {
        from: accounts[1]
      })

      await rps.getReward(gameName('newGame'), { from: accounts[1] })

      try {
        await rps.getReward(gameName('newGame'), { from: accounts[1] })
      } catch (e) {
        if (e.message.indexOf('revert') > -1) {
          return
        } else {
          assert.fail(null, null, `Expected 'revert' exception, got "${e.message}"`)
        }
      }
    })
  })
})
