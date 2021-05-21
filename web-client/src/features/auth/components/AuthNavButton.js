import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

import PlainLink from 'features/topnav/components/PlainLink';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


function AuthNavButton() {
  const user = useSelector(selectUser);

  if (user.pk) {
    return (
      <>
        <Typography>
          DEQ Balance {user.deq_balance}
        </Typography>

        <PlainLink to="/profile">
          <AccountCircleIcon fontSize="large"/>
        </PlainLink>
      </>
    );
  }

  return (
    <>
      <PlainLink to="/signup">
        <Button variant="contained" color="secondary">Signup</Button>
      </PlainLink>

      <PlainLink to="/login">
        <Button color="inherit">Login</Button>
      </PlainLink>
    </>
  );
}

export default AuthNavButton;
