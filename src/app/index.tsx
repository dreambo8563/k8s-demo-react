// import "antd/dist/antd.less"
import "../assets/less/font-awesome.less"
import "../assets/main.css"

import { LocaleProvider } from "antd"
import zh_CN from "antd/lib/locale-provider/zh_CN"
import { configure } from "mobx"
import React from "react"
import ReactDOM from "react-dom"

import App from "./routers"

// enable MobX strict mode
configure({ enforceActions: "always" })

// render react DOM
ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <App />
  </LocaleProvider>,
  document.getElementById("app")
)
