import { httpPost } from "@utils/http"

export const login = (params: object) => httpPost("/api/auth/login", params)
