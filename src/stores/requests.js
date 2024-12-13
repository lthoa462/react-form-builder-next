import axios from "axios";

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: '',
};

// export function post(url, data) {
//   return fetch(url, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(data),
//   }).then(response => response);
// }

// export function get(url) {
//   return fetch(url, {
//     method: 'GET',
//     headers,
//   }).then(response => response.json());
// }

export function post(url, data) {
  return axios.post(
    url,
    data,
    {
      header: headers,
      withCredentials: true,
      credentials: 'include'
    }
  );
}

export function get(url) {
  return axios.get(
    url,
    {
      header: headers,
      withCredentials: true,
      credentials: 'include'
    }
  );
}
