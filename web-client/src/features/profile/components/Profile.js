import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TransactionTable from 'features/profile/components/TransactionTable';

import AuthRedirect from 'features/auth/components/AuthRedirect';
import LogoutButton from 'features/auth/components/LogoutButton';
import ProfileData from 'features/auth/components/ProfileData';

import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function Profile() {
  const classes = useStyles();
  return (
    <Grid
      alignItems="center"
      container
      direction="row"
      justify="center"
      spacing={3}
    >
      <AuthRedirect />
      <Grid className={classes.centeredGrid} item xs={12}>
        <ProfileData />
      </Grid>
      <Grid className={classes.centeredGrid} item xs={12}>
        <LogoutButton />
      </Grid>
      <Grid className={classes.centeredGrid} item xs={12} sm={8}>
        <TransactionTable />
      </Grid>
    </Grid>
  );
}

export default Profile;
