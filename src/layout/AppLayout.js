import React, { Component } from 'react'
import { Container, Header, Title, Body, Content } from 'native-base'

import FooterNavigation from './FooterNavigation'

export default class AppLayout extends Component {
  render() {
    const { title, children } = this.props
    return (
      <Container>
        <Header>
          <Body>
            <Title>{title}</Title>
          </Body>
        </Header>
        <Content padder>{children}</Content>
        <FooterNavigation />
      </Container>
    )
  }
}
