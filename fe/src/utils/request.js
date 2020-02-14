import axios from 'axios'

export default async (path, data, method = 'get') => {
    const response = await axios[method.toLowerCase()](path, data)
    if (response.status === 200) {
        const { data } = response
        if (data.success) {
            return data.result
        } else {
            console.error(data.message)
        }
    }
}