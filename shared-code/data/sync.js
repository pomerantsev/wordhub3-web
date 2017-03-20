export function syncData (timestamp, data) {
  return fetch(process.env.API_SERVER + '/sync-data?token=' + process.env.TEMP_TOKEN + (timestamp ? '&timestamp=' + timestamp : ''), {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  }).then(res => res.json())
    .catch(err => console.log(err));
}
