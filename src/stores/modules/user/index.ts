import {defineStore} from "pinia";
import {logout} from "@/api/user";
import storage from "@/utils/storage";
import {KEY_TOKEN} from "@/constant/cache";

const useUserStore = defineStore('user', {
    state: () => ({}),
    actions: {
        logout() {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    if (res.code === 500) {
                        reject(res)
                    } else {
                        storage.remove(KEY_TOKEN)
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                });
            })
        }
    }
})

export default useUserStore;
