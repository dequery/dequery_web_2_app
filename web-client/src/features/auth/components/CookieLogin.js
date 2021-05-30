import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch } from 'react-redux';

import { retrieveUser } from 'features/auth/authSlice';


function CookieLogin() {
  const dispatch = useDispatch();
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  if (accessToken && refreshToken) {
    dispatch(retrieveUser());
  }
  return <div/>;
}

export default CookieLogin;
