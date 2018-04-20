import React, { Component } from 'react'
import { Text, View } from 'react-native'

import AppLayout from '../layout/AppLayout'
import { GameStatus } from '../rps/rpsApi'
import withGameStatus from '../rps/withGameStatus'
import NewGame from './NewGame'
import JoinGame from './JoinGame'
import RevealShape from './RevealShape'
import WaitForOtherPlayer from './WaitForOtherPlayer'
import CollectReward from './CollectReward'

class RpsGameWizard extends Component {
  componentDidMount() {
    this.currentGameName = this.getGameName()
  }

  getGameName() {
    return this.props.navigation.state.params.gameName
  }

  componentWillReceiveProps(newProps) {
    const newGameName = newProps.navigation.state.params.gameName
    if (this.currentGameName !== newGameName) {
      newProps.refreshGameStatus()
      this.currentGameName = newGameName
    }
  }

  render() {
    const { gameStatus, gameInfo } = this.props

    const gameStatusNumber = gameStatus.toNumber()
    switch (gameStatusNumber) {
      case GameStatus.notStarted:
        return <NewGame />
      case GameStatus.choosing:
        return gameInfo ? <WaitForOtherPlayer /> : <JoinGame />
      case GameStatus.revealing:
        if (gameInfo) {
          return gameInfo.revealed ? <WaitForOtherPlayer waitToRevealShape /> : <RevealShape />
        } else {
          return <Message>This game is in progress, but your are not participating in it.</Message>
        }
      case GameStatus.player1Won:
        return gameInfo ? <CollectReward /> : <h2>Player 1 Won</h2>
      case GameStatus.player2Won:
        return gameInfo ? <CollectReward /> : <h2>Player 2 Won</h2>
      case GameStatus.tie:
        return gameInfo ? <CollectReward /> : <h2>It's a Tie</h2>
      default:
        return <Message>Error. Unexpected game status {gameStatusNumber}</Message>
    }
  }
}

const Message = ({ children }) => (
  <AppLayout>
    <View style={{ alignSelf: 'auto' }}>
      <Text>{children}</Text>
    </View>
  </AppLayout>
)

export default withGameStatus(RpsGameWizard)
