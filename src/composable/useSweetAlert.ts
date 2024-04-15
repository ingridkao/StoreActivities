import { getCurrentInstance } from 'vue'

export function useSweetAlert() {
    const { proxy } = getCurrentInstance()
    const errorAlert = (text:string='') => {
        return proxy.$swal.fire({
            icon: "error",
            title: '出了一點問題',
            text
        })
    }

    return { errorAlert }
}