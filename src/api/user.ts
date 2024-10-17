import {post} from "@/api/index";

// export const logout = (): void => post('/sys/login/logout')

export function logout() {
    return post('/sys/login/logout')
}
