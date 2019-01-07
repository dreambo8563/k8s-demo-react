import { login } from "@constants/api"
import { STORE_APP, STORE_ROUTER, STORE_USER } from "@constants/stores"
import { AppStore, UserStore } from "@stores"
import { Button, Form, Icon, Input } from "antd"
import { FormComponentProps } from "antd/lib/form"
import cx from "classnames"
import { inject, observer } from "mobx-react"
import { RouterStore } from "mobx-react-router"
import React, { Component } from "react"

import s from "./style.css"

export interface LoginProps extends FormComponentProps {}

export interface LoginState {}

enum LoginFromProps {
  UserName = "userName",
  Password = "password"
}
enum LoginFromMsg {
  UserName = "Please input your username!",
  Password = "Please input your Password!"
}
enum LoginFromPlaceholder {
  UserName = "Username",
  Password = "Password"
}

const FormItem = Form.Item

@inject(STORE_APP, STORE_USER, STORE_ROUTER)
@observer
class Login extends Component<LoginProps, LoginState> {
  private readonly inputIconStyle = { color: "rgba(0,0,0,.25)" }

  constructor(props: LoginProps) {
    super(props)
  }

  public render() {
    const { getFieldDecorator } = this.props.form
    const { canSubmit } = this.props[STORE_USER]

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator(LoginFromProps.UserName, {
            rules: [{ required: true, message: LoginFromMsg.UserName }]
          })(
            <Input
              onChange={e => this.handleOnChange(LoginFromProps.UserName, e)}
              prefix={<Icon type="user" style={this.inputIconStyle} />}
              placeholder={LoginFromPlaceholder.UserName}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator(LoginFromProps.Password, {
            rules: [{ required: true, message: LoginFromMsg.Password }]
          })(
            <Input
              onChange={e => this.handleOnChange(LoginFromProps.Password, e)}
              prefix={<Icon type="lock" style={this.inputIconStyle} />}
              type="password"
              placeholder={LoginFromPlaceholder.Password}
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={!canSubmit}>
            Log in
          </Button>
        </FormItem>
        <div className={cx(s.red)}>test for classNames and styles</div>
      </Form>
    )
  }

  private handleSubmit: React.FormEventHandler<any> = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login(values)
          .then((result: { token: string }) => {
            const { token } = result
            const { setToken } = this.props[STORE_APP] as AppStore
            setToken(token)
            const router = this.props[STORE_ROUTER] as RouterStore
            router.push("/home")
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  }

  private handleOnChange = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { setName, setPassword } = this.props[STORE_USER] as UserStore
    if (type === LoginFromProps.UserName) {
      setName(e.target.value)
    }
    if (type === LoginFromProps.Password) {
      setPassword(e.target.value)
    }
  }
}

export default Form.create()(Login)
