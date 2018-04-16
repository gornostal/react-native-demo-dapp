# Nuances

* React Native uses javascriptCore which doesn't have modules that Web3 depends on
* We must use `babel-preset-react-native-web3` as a workaround
* We must use Web3 `^0.20.6`
* `truffle-contract` doesn't work even with `babel-preset-react-native-web3` so we must call contract methods using Web3 API
