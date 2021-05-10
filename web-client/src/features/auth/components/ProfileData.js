import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

import Grid from '@material-ui/core/Grid';


function ProfileData() {
  const user = useSelector(selectUser);

  return (
    <Grid>
      {user ? user.display_name : ''}
    </Grid>
  );
}

export default ProfileData;
