import { httpPost } from "../utils/http"

export const login = (params: object) => httpPost("/auth/login", params)
