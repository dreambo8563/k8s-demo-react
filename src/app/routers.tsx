import { STORE_APP, STORE_LOGIN, STORE_ROUTER } from "@constants/stores"
import { loadComponent } from "@utils/loadComponent"
import { createBrowserHistory } from "history"
import { Provider } from "mobx-react"
import React from "react"
import { Redirect, Route, Router, Switch } from "react-router"

import { Root } from "./layouts/Root"
import { AppStore, LoginStore, RouterStore } from "./stores"

// prepare MobX stores
export const history = createBrowserHistory()
const routerStore = new RouterStore(history)
export const appStore = new AppStore()
export const loginStore = new LoginStore()
const rootStores = {
  [STORE_ROUTER]: routerStore,
  [STORE_APP]: appStore,
  [STORE_LOGIN]: loginStore
}

export default class App extends React.Component {
  public render() {
    return (
      <Provider {...rootStores}>
        <Root>
          <Router history={history}>
            <Switch>
              <Redirect exact from="/" to="/login" />
              <Route
                path="/login"
                component={loadComponent(() =>
                  import("./containers/Demo/Login").then(
                    (module: any) => module.default
                  )
                )}
              />
              <Route
                path="/404"
                component={loadComponent(() =>
                  import("./components/Common/NotFound").then(
                    (module: any) => module.default
                  )
                )}
              />
              <Route
                component={loadComponent(() =>
                  import("./components/Common/NotFound").then(
                    (module: any) => module.default
                  )
                )}
              />
            </Switch>
          </Router>
        </Root>
      </Provider>
    )
  }
}
