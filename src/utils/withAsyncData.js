import React from 'react'

/**
 * HOC for async functions
 */
export default function withAsyncData(propName, asyncFn) {
  return function(WrappedComponent) {
    class WithAsyncData extends React.Component {
      constructor(props) {
        super(props)
        this.load = this.load.bind(this)
        this.state = { pending: false, error: null, data: null }
      }

      componentWillUnmount() {
        this.unmounted = true
      }

      async load(...args) {
        this.setState({ pending: true, error: null, data: null })
        try {
          const data = await asyncFn(...args)
          if (!this.unmounted) {
            this.setState({ pending: false, data })
          }
        } catch (e) {
          if (!this.unmounted) {
            this.setState({ pending: false, error: e })
          }
        }
      }

      render() {
        const newProps = {
          [propName]: {
            ...this.state,
            load: this.load
          },
          ...this.props
        }
        return <WrappedComponent {...newProps} />
      }
    }

    WithAsyncData.displayName = `WithAsyncData-${propName}(${getDisplayName(WrappedComponent)})`

    return WithAsyncData
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}
