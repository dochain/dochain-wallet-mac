import Axios from 'axios'

const axiosInstance = Axios.create({
  baseURL: 'https://cdn.bootcss.com',
  timeout: 10000
})

export default axiosInstance
