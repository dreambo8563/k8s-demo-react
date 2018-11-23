import { action, computed, observable } from "mobx"

export class LoginStore {
  @observable public userName: string | undefined = undefined
  @observable public password: string | undefined = undefined

  @action.bound
  public setName(userName: string | undefined) {
    this.userName = userName
  }

  @action.bound
  public setPassword(password: string | undefined) {
    this.password = password
  }
  @computed
  get canSubmit(): boolean {
    return !!(this.userName && this.password)
  }
}

export default LoginStore
