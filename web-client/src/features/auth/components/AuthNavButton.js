import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout, selectUser } from '../authSlice';

import Button from '@material-ui/core/Button';
import PlainLink from '../../topnav/components/PlainLink';


function AuthNavButton() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  if (user) {
    return (
      <Button color="inherit" onClick={() => dispatch(logout())}>Logout</Button>
    );
  }
  return (
      <PlainLink to="/login">
        <Button color="inherit">Login</Button>
      </PlainLink>
  );
}

export default AuthNavButton;
