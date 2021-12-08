import axios from 'axios';
import { message } from 'antd';

export function configAxios(): void {
  axios.interceptors.response.use(response => {
    return response.data;
  }, error => {
    if (error.response.config.headers.silent !== true) {
      if (error.response.status === 404) {
        message.error(`${error.response.status}, ${error.response.config.url} not found.`);
      } else {
        message.error(error.response.data.message || error.response.data.error || error.response.data);
      }
    }
  
    return Promise.reject(error);
  });
}
