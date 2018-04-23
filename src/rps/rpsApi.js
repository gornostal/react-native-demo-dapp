import { SubmissionError } from 'redux-form'
import DefaultPreference from 'react-native-default-preference'
import { generateSecureRandom } from 'react-native-securerandom'

import getWeb3 from '../utils/getWeb3'
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
  const gameNameHex = getWeb3().toHex(gameName)
  return await getRpsContract().getGameStatus(gameNameHex)
}

export const getWinnerAddress = async gameName => {
  const web3 = getWeb3()
  const gameNameHex = web3.toHex(gameName)
  const rps = await getRpsContract()
  return await rps.getWinnerAddress(gameNameHex)
}

export const getBetValue = async gameName => {
  const web3 = getWeb3()
  const gameNameHex = web3.toHex(gameName)
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
    throw new SubmissionError({ ...errors, _error: 'Please fix the errors' })
  }

  const web3 = getWeb3()
  const gameNameHex = web3.toHex(formData.gameName)
  const status = (await getGameStatus(formData.gameName)).toNumber()
  if (status !== GameStatus.notStarted) {
    throw new SubmissionError({
      gameName: 'This game name was already used. Please choose another one',
      _error: 'Please fix the error'
    })
  }

  throw new SubmissionError({
    shape: shapeHash(formData.shape, await randomHex(32)),
    _error: 'Errors'
  })

  const rps = await getRpsContract()
  const { secret } = await gameParameters.save(formData.gameName, formData.fromAccount, formData.shape)
  const hash = shapeHash(formData.shape, secret)
  const tx = await rps.startGame(gameNameHex, hash, {
    from: formData.fromAccount,
    value: web3.toWei(formData.bet, 'ether')
  })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new SubmissionError({ _error: 'Transaction error. Check the logs' })
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
    throw new SubmissionError({ ...errors, _error: 'Please fix the errors' })
  }

  const status = (await getGameStatus(formData.gameName)).toNumber()
  if (status !== GameStatus.choosing) {
    throw new SubmissionError({
      gameName: 'This game cannot be joined'
    })
  }

  const web3 = getWeb3()
  const gameNameHex = web3.toHex(formData.gameName)
  const rps = await getRpsContract()
  const { secret } = gameParameters.save(formData.gameName, formData.fromAccount, formData.shape)
  const hash = shapeHash(formData.shape, secret)
  const tx = await rps.joinGame(gameNameHex, hash, {
    from: formData.fromAccount,
    value: formData.betWei
  })
  if (parseInt(tx.receipt.status, 16) !== 1) {
    console.log('tx', tx)
    throw new SubmissionError({ _error: 'Transaction error. Check the logs' })
  }
}

export const getReward = async gameName => {
  const { account } = gameParameters.get(gameName)
  const web3 = getWeb3()
  const gameNameHex = web3.toHex(gameName)
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
  const web3 = getWeb3()
  const gameNameHex = web3.toHex(gameName)
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
  return getWeb3().sha3({ t: 'uint8', v: shapes[shape] }, { t: 'bytes32', v: secret })
}

export const gameParameters = {
  async save(gameName, account, shape) {
    const storageKey = `game-secret-${gameName}`
    const data = {
      secret: await randomHex(32),
      account,
      shape,
      revealed: false,
      rewarded: false
    }
    await DefaultPreference.set(storageKey, JSON.stringify(data))
    return data
  },
  async get(gameName) {
    const storageKey = `game-secret-${gameName}`
    const game = await DefaultPreference.get(storageKey)
    if (!game) {
      return
    }

    return JSON.parse(game)
  },
  async update(gameName, updates) {
    const params = gameParameters.get(gameName)
    if (!params) {
      throw new Error('Invalid game name')
    }

    const newParams = { ...params, ...updates }
    const storageKey = `game-secret-${gameName}`
    await DefaultPreference.set(storageKey, JSON.stringify(newParams))
    return newParams
  },
  async remove(gameName) {
    const storageKey = `game-secret-${gameName}`
    await DefaultPreference.clear(storageKey)
  }
}

async function randomHex(length) {
  const rand = await generateSecureRandom(10)
  return getWeb3().toHex(rand).substr(0, length)
}