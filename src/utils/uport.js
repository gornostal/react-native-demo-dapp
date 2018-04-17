import configureUportConnect from 'react-native-uport-connect'

class Uport {
  constructor(config) {
    const { uport, MNID } = configureUportConnect(config)
    this.connection = uport
    this.MNID = MNID
  }

  async requestCredentials() {
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
    return { ...resp, ethAddress: this.MNID.decode(resp.address).address }
  }
}

var uportInstance = null
const getUport = () => {
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

export default getUport
