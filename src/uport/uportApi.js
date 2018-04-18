import AsyncStorage from 'rn-async-storage'
import configureUportConnect from 'react-native-uport-connect'

import dummyCredentials from './dummyCredentials.json'

export class Uport {
  credStorageKey = 'uport:credentials'

  constructor(config) {
    const { uport, MNID } = configureUportConnect(config)
    this.connection = uport
    this.MNID = MNID
  }

  /**
   * Loads previously requested credentials from AsyncStorage
   * Returns either credentials or an empty object
   */
  async loadCredentials() {
    const credentials = await AsyncStorage.getItem(this.credStorageKey)
    console.log(credentials)
    return credentials ? JSON.parse(credentials) : null
  }

  async clearCredentials() {
    await AsyncStorage.setItem(this.credStorageKey, '')
  }

  /**
   * Temporary method
   */
  requestCredentials() {
    return new Promise(resolve => {
      setTimeout(async () => {
        const credentials = dummyCredentials
        await AsyncStorage.setItem(this.credStorageKey, JSON.stringify(credentials))
        resolve(credentials)
      }, 7e3)
    })
  }

  /**
   * Triggers Uport Request Credentials flow
   * and saves them to AsyncStorage
   */
  async XrequestCredentials() {
    var resp
    try {
      resp = await this.connection.requestCredentials({ requested: ['name', 'avatar'] })
    } catch (e) {
      const err = e + ''
      if (err.indexOf('Could not open URL') >= 0) {
        throw new Error('Please install uPort app on your device')
      } else {
        throw e
      }
    }
    const credentials = { ...resp, ethAddress: this.MNID.decode(resp.address).address }
    await AsyncStorage.setItem(this.credStorageKey, JSON.stringify(credentials))
    return credentials
  }
}

var uportInstance = null
export const getUport = () => {
  if (uportInstance) {
    return uportInstance
  }
  uportInstance = new Uport({
    appName: 'Rock-Paper-Scissors',
    appAddress: '2ome7iDVtifcK4ckSuWH4VZ8rk8tF3LPrtA',
    network: 'rinkeby',
    privateKey: '11fa13568e00a9e159fc5254d90bfd592c536678920b6d59c4984ec06e7779b2'
  })
  return uportInstance
}
