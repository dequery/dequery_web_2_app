import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

import Grid from '@material-ui/core/Grid';


function ProfileData() {
  const user = useSelector(selectUser);
  console.log(user);

  if (!user) {
    return (
      <Redirect to="/"/>
    )
  }

  return (
    <Grid>
      {user.display_name}
    </Grid>
  );
}

export default ProfileData;
