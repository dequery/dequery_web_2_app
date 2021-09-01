import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser, retrieveUser } from 'features/auth/authSlice';


function CookieLogin() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');

  if (!user.pk && accessToken && refreshToken) {
    dispatch(retrieveUser());
  }
  return <div/>;
}

export default CookieLogin;
