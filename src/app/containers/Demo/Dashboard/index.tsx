import { STORE_APP, STORE_ROUTER, STORE_USER } from "@constants/stores"
import { AppStore, UserStore } from "@stores"
import { Button } from "antd"
import { inject, observer } from "mobx-react"
import { Component } from "react"
import React from "react"

// 如果需要用到css
// import * as style from "./style.css"

export interface DashboardProps {}

export interface DashboardState {}

// 如果要注入store
@inject(STORE_APP, STORE_ROUTER, STORE_USER)
@observer
export default class Dashboard extends Component<
  DashboardProps,
  DashboardState
> {
  constructor(props: DashboardProps, context: any) {
    super(props, context)
    this.state = {}
  }
  public componentWillMount() {
    // 此处可以加载请求
  }
  public componentDidMount() {
    // 此处可以处理带ref的
  }
  public render() {
    const { userName } = this.props[STORE_USER] as UserStore
    const { getToken } = this.props[STORE_APP] as AppStore
    return (
      <div>
        <h1>Hi~ {userName}</h1>
        <span>token: {getToken()}</span>
        <br />
        <Button type="primary">test</Button>
      </div>
    )
  }
}
