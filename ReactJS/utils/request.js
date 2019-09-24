import fetch from 'dva/fetch';
import qs from 'qs'
import { message } from 'antd';
import router from 'umi/router';

function parseJSON(response) {
  return response.json()
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkRet({data}) {
  if (data.ret !== 1003) {
    return {data};
  }
  message.error(data.code, 1, function () {
    localStorage.removeItem('userInfo')
    router.push('/login')
  })
}


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  // console.log(process.env.baseUrl);
  return fetch(`${process.env.baseUrl}${url}`, Object.assign(options, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...options.headers
    },
  }, { 
    body: qs.stringify(options.body)
  }))
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .then(checkRet)
    .catch(err => ({ err }))
}
// export default async function request(url, options) {
//   const response = await fetch(url, options);

//   checkStatus(response);

//   const data = await response.json();

//   const ret = {
//     data,
//     headers: {},
//   };

//   if (response.headers.get('x-total-count')) {
//     ret.headers['x-total-count'] = response.headers.get('x-total-count');
//   }

//   return ret;
// }
