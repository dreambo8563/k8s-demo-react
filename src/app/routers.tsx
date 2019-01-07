import { STORE_APP, STORE_ROUTER, STORE_USER } from "@constants/stores"
import { Path } from "@constants/url"
import { Root } from "@layouts/Root"
import { loadComponent } from "@utils/loadComponent"
import { createBrowserHistory } from "history"
import { Provider } from "mobx-react"
import React from "react"
import { Redirect, Route, Router, Switch } from "react-router"

import { AppStore, RouterStore, UserStore } from "./stores"

// prepare MobX stores
export const history = createBrowserHistory()
const routerStore = new RouterStore(history)
export const appStore = new AppStore()
export const userStore = new UserStore()
const rootStores = {
  [STORE_ROUTER]: routerStore,
  [STORE_APP]: appStore,
  [STORE_USER]: userStore
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
                path="/home"
                component={loadComponent(() =>
                  import("./containers/Demo/Dashboard").then(
                    (module: any) => module.default
                  )
                )}
              />
              <Route
                path={Path.Not_Found}
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
