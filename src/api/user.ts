import {post} from "@/api/index";

export function logout() {
    return post('/sys/login/logout')
}
