import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const setTitle = title => {
  return {
    type: 'SCREEN_TITLE/SET',
    payload: title
  }
}

class ScreenTitle extends Component {
  componentDidMount() {
    const { screenTitle, actions, children } = this.props
    if (screenTitle !== children) {
      actions.setTitle(children)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  screenTitle: state.screenTitle
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setTitle }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreenTitle)

export const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SCREEN_TITLE/SET':
      return action.payload

    default:
      return state
  }
}
