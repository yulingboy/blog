import axios from 'axios';
// import { getUserCookie } from '@/utils/userCookie';
import { Message } from 'element-ui';
const instance = axios.create({
  // baseURL: 'http://127.0.0.1:3000/api/admin/v2/' 
  baseURL: 'http://127.0.0.1:3000/api/v1/blog'
});
instance.interceptors.request.use(
  config => {
    // console.log(sessionStorage.getItem('token'))
    config.headers.Authorization = localStorage.getItem('token');

    return config;
  },
  err => Promise.reject(err)
);

instance.interceptors.response.use(
  response => {
    if (response.data.meta.code !== 1000) {
      // if (response.data.meta.code === 401) {
      //   router.push('/');
      // }
      Message({
        showClose: true,
        message: response.data.meta.message,
        type: 'erorr'
      });

      return false;
    } else {
      return response.data;
    }
  },
  err => Promise.reject(err)
);
export default instance;
