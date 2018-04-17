import React, { Component } from "react"
import { Text, Image } from "react-native"

import { Form, Item, Input, Button } from "native-base"
import rpsImage from "../../assets/rock-paper-scissors.png"
import AppLayout from "../layout/AppLayout"
import getUport from "../utils/uport"

class EnterGameName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pending: false,
      data: null,
      error: null
    }
  }

  async componentDidMount() {
    this.setState({ pending: true })
    try {
      const creds = await getUport().requestCredentials()
      this.setState({ pending: false, data: creds })
    } catch (e) {
      this.setState({ pending: false, error: e + "" })
    }
  }

  render() {
    return (
      <AppLayout title="Create or join a game">
        <Image style={styles.image} source={rpsImage} />
        <Form>
          <Item>
            <Input placeholder="Game name" />
          </Item>
          <Button block primary>
            <Text style={styles.submitBtn}>Submit</Text>
          </Button>
        </Form>
        {this.state.pending && <Text>Loading...</Text>}
        {!this.state.pending && !this.state.error && this.state.data && <Text>Data: {this.state.data.name}</Text>}
        {this.state.error && <Text style={{ color: "red" }}>{this.state.error}</Text>}
      </AppLayout>
    )
  }
}

export default EnterGameName

const styles = {
  image: {
    flex: 1,
    height: 100,
    marginTop: 30,
    marginBottom: 20,
    resizeMode: "contain",
    alignSelf: "center"
  },
  submitBtn: {
    color: "#fff"
  }
}
