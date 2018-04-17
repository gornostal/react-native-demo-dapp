# Nuances

* React Native uses javascriptCore which doesn't have modules that Web3 depends on
* We must use `babel-preset-react-native-web3` as a workaround
* We must use Web3 `^0.20.6` because v1.0 relies on "crypto" module
* `truffle-contract` doesn't work even with `babel-preset-react-native-web3` so we must call contract methods using Web3 API
* In order to connect uPort I had to add certain native capabilities. 
  So I switched from Create React Native App & Expo to `react-native init`.
