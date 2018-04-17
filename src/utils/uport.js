import { Connect, SimpleSigner } from 'uport-connect'

class Uport {
  constructor(appName, config) {
    this.connection = new Connect(appName, config)
  }

  async requestCredentials() {
    console.log('requesting credentials...')
    const credentials = await this.connection.requestCredentials({
      requested: ['name', 'avatar'],
      notifications: true
    })
    console.log('credentials', credentials)
    return credentials
  }
}

var uportInstance = null
const getUport = () => {
  if (uportInstance) {
    return uportInstance
  }
  uportInstance = new Uport('Rock-Paper-Scissors', {
    clientId: '2ome7iDVtifcK4ckSuWH4VZ8rk8tF3LPrtA',
    network: 'rinkeby',
    signer: SimpleSigner('11fa13568e00a9e159fc5254d90bfd592c536678920b6d59c4984ec06e7779b2')
  })
  return uportInstance
}

export default getUport
