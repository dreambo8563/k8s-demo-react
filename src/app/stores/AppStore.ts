import { action, observable } from "mobx"

export class AppStore {
  @observable public loading: boolean
  @observable public title: string
  constructor() {
    this.loading = false
    this.title = ""
  }

  @action
  public setLoading = (loading: boolean): void => {
    this.loading = loading
  }
  @action
  public setTitle = (title: string): void => {
    this.title = title
  }

  public setToken = (token: string): void => {
    localStorage.setItem("token", token)
  }
  public getToken = (): string => {
    return localStorage.getItem("token")
  }
}

export default AppStore
