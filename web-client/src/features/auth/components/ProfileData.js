import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


function ProfileData() {
  const user = useSelector(selectUser);

  if (Object.keys(user).length === 0) {
    return <div/>;
  }

  return (
    <Grid
      alignItems="center"
      container
      direction="row"
      justify="center"
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography>
          Display name: {user.display_name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>
          DEQ balance: {user.deq_balance}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProfileData;
