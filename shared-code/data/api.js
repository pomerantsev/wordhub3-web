const API_VERSION = 'v1';

export function syncData (timestamp, data) {
  return fetch(`${process.env.API_SERVER}/${API_VERSION}/sync-data?token=${process.env.TEMP_TOKEN}${timestamp ? '&timestamp=' + timestamp : ''}`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  }).then(res => res.json())
    .catch(err => console.log(err));
}

export async function login (email, password) {
  const res = await fetch(`${process.env.API_SERVER}/${API_VERSION}/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({email, password})
  });
  const data = await res.json();
  return data;
}
