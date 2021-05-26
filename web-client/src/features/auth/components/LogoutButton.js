import React from 'react';
import { useDispatch } from 'react-redux';

import { logout } from 'features/auth/authSlice';

import Button from '@material-ui/core/Button';


function LogoutButton() {
  const dispatch = useDispatch();

  return (
    <Button variant="contained" color="primary" onClick={() => dispatch(logout())}>
      Logout
    </Button>
  );
}

export default LogoutButton;
