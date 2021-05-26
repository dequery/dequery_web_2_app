import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

function AuthRedirect() {
  const user = useSelector(selectUser);

  if (Object.keys(user).length === 0) {
    return <Redirect to="/login" />;
  }
  return <div/>;
}

export default AuthRedirect;
