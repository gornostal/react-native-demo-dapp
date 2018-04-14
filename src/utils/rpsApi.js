import { utils } from 'web3'
import getWeb3 from './getWeb3'
import getRpsContract from './getRpsContract'

const shapes = {
  rock: '0',
  paper: '1',
  scissors: '2'
}

export const GameStatus = {
  notStarted: 0,
  choosing: 1,
  revealing: 2,
  player1Won: 3,
  player2Won: 4,
  tie: 5
}

export const getGameStatus = async gameName => {
  const gameNameHex = utils.utf8ToHex(gameName)
  return gameNameHex
  // const rps = await getRpsContract()
  // return await rps.getGameStatus(gameNameHex)
}

export const getWinnerAddress = async gameName => {
  const gameNameHex = utils.utf8ToHex(gameName)
  const rps = await getRpsContract()
  return await rps.getWinnerAddress(gameNameHex)
}

export const getBetValue = async gameName => {
  const gameNameHex = utils.utf8ToHex(gameName)
  const rps = await getRpsContract()
  return await rps.getBetValue(gameNameHex)
}

export const getAccounts = async () => {
  const web3 = getWeb3()
  return await web3.eth.getAccounts()
}

export const startGame = async formData => {
  const errors = {}
  if (!formData.fromAccount) {
    errors.fromAccount = 'Select your account'
  }
  if (!formData.gameName) {
    errors.gameName = 'Game name cannot be empty'
  }
  if (!formData.bet) {
    errors.bet = 'Bet cannot be empty'
  }
  if (isNaN(Number(formData.bet))) {
    errors.bet = 'Bet must be a valid number of Ether'
  }
  if (['rock', 'paper', 'scissors'].indexOf(formData.shape) === -1) {
    errors.shape = 'Please pick a hand shape'
  }

  if (Object.keys(errors).length > 0) {
    throw new Error({ ...errors, _error: 'Please fix the errors' })
  }

  const gameNameHex = utils.utf8ToHex(formData.gameName)
  const status = (await getGameStatus(formData.gameName)).toNumber()
  if (status !== GameStatus.notStarted) {
    throw new Error({
      gameName: 'This game name was already used. Please choose another one',
      _error: 'Please fix the error'
    })
  }

  const rps = await getRpsContract()
  const { secret } = gameParameters.save(formData.gameName, formData.fromAccount, formData.shape)
  const hash = shapeHash(formData.shape, secret)
  const tx = await rps.startGame(gameNameHex, hash, {
    from: formData.fromAccount,
    value: utils.toWei(formData.bet, 'ether')
  })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new Error({ _error: 'Transaction error. Check the logs' })
  }
}

export const joinGame = async formData => {
  const errors = {}
  if (!formData.fromAccount) {
    errors.fromAccount = 'Select your account'
  }
  if (['rock', 'paper', 'scissors'].indexOf(formData.shape) === -1) {
    errors.shape = 'Please pick a hand shape'
  }

  if (Object.keys(errors).length > 0) {
    throw new Error({ ...errors, _error: 'Please fix the errors' })
  }

  const status = (await getGameStatus(formData.gameName)).toNumber()
  if (status !== GameStatus.choosing) {
    throw new Error({
      gameName: 'This game cannot be joined'
    })
  }

  const gameNameHex = utils.utf8ToHex(formData.gameName)
  const rps = await getRpsContract()
  const { secret } = gameParameters.save(formData.gameName, formData.fromAccount, formData.shape)
  const hash = shapeHash(formData.shape, secret)
  const tx = await rps.joinGame(gameNameHex, hash, {
    from: formData.fromAccount,
    value: formData.betWei
  })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new Error({ _error: 'Transaction error. Check the logs' })
  }
}

export const getReward = async gameName => {
  const { account } = gameParameters.get(gameName)
  const gameNameHex = utils.utf8ToHex(gameName)
  const rps = await getRpsContract()
  const tx = await rps.getReward(gameNameHex, { from: account })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new Error('Transaction error. Check the logs')
  }
  gameParameters.update(gameName, { rewarded: true })
  return true
}

export const revealShape = async gameName => {
  const { secret, account, shape } = gameParameters.get(gameName)
  const gameNameHex = utils.utf8ToHex(gameName)
  const rps = await getRpsContract()
  const tx = await rps.revealSecret(gameNameHex, shapes[shape], secret, { from: account })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new Error('Transaction error. Check the logs')
  }
  gameParameters.update(gameName, { revealed: true })
  return true
}

function shapeHash(shape, secret) {
  return utils.soliditySha3({ t: 'uint8', v: shapes[shape] }, { t: 'bytes32', v: secret })
}

export const gameParameters = {
  save(gameName, account, shape) {
    const storageKey = `game-secret-${gameName}`
    const data = {
      secret: utils.randomHex(32),
      account,
      shape,
      revealed: false,
      rewarded: false
    }
    localStorage.setItem(storageKey, JSON.stringify(data))
    return data
  },
  get(gameName) {
    const storageKey = `game-secret-${gameName}`
    if (!localStorage.getItem(storageKey)) {
      return
    }

    return JSON.parse(localStorage.getItem(storageKey))
  },
  update(gameName, updates) {
    const params = gameParameters.get(gameName)
    if (!params) {
      throw new Error('Invalid game name')
    }

    const newParams = { ...params, ...updates }
    const storageKey = `game-secret-${gameName}`
    localStorage.setItem(storageKey, JSON.stringify(newParams))
    return newParams
  },
  remove(gameName) {
    const storageKey = `game-secret-${gameName}`
    localStorage.removeItem(storageKey)
  }
}
