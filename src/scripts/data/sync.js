export function getData (timestamp) {
  return fetch(process.env.API_SERVER + '/get-data' + (timestamp ? '?timestamp=' + timestamp : ''))
    .then(res => res.json());
}

export function sendData (data) {
  return fetch(process.env.API_SERVER + '/send-data', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  }).catch(err => console.log(err));
}
