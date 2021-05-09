import Cookies from 'js-cookie'


async function retrieveAccessToken() {
  const refreshResponse = await fetch(
    `${process.env.REACT_APP_DEQUERY_API_BASE}/api/token/refresh/`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'refresh': Cookies.get('refreshToken') }),
    }
  );
  const data = refreshResponse.json();
  if (refreshResponse.ok) {
    return data.access;
  }
  return null;
}

async function dequeryClient(route, method, thunkAPI, payload = {}, useJwt = false) {
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
  if (Object.keys(payload).length !== 0) {
    requestOptions.body = JSON.stringify(payload);
  }
  if (useJwt) {
    requestOptions.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_DEQUERY_API_BASE}${route}`, requestOptions);
    let data = await response.json();
    if (response.ok) {
      return data;
    } else if (data.code === 'token_not_valid') {
      const accessToken = await retrieveAccessToken();
      if (accessToken) {
        Cookies.set('accessToken', accessToken);
        return dequeryClient(route, method, thunkAPI, payload, useJwt);
      } else {
        return thunkAPI.rejectWithValue({ detail: 'Authentication expired please logout and re-login' });
      }
    } else {
      return data.detail ? thunkAPI.rejectWithValue(data) : thunkAPI.rejectWithValue({ deatil: JSON.stringify(data) });
    }
  } catch (e) {
    thunkAPI.rejectWithValue({ detail: e.message });
  }
}

export default dequeryClient;
