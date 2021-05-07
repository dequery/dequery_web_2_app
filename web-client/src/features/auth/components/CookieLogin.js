import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser, setUser } from 'features/auth/authSlice';


function CookieLogin() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  if (user) {
    return <div/>;
  }

  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');
  if (accessToken && refreshToken) {
    dispatch(setUser({ access: accessToken, refresh: refreshToken }));
  }
  return <div/>;
}

export default CookieLogin;
