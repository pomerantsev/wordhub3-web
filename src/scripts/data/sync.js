export function getData (timestamp) {
  return fetch(process.env.API_SERVER + '/get-data' + (timestamp ? '?timestamp=' + timestamp : ''))
    .then(res => res.json());
}
