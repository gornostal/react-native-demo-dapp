import React from "react"
import { StyleProvider } from "native-base"

import Rps from "./src/Rps"
import getTheme from "./src/theme/components"
import variables from "./src/theme/variables/commonColor"

const App = () => (
  <StyleProvider style={getTheme(variables)}>
    <Rps />
  </StyleProvider>
)

export default App
