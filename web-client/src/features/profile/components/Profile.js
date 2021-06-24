import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import { retrieveUser } from 'features/auth/authSlice';

import TransactionTable from 'features/profile/components/TransactionTable';

import AuthRedirect from 'features/auth/components/AuthRedirect';
import LogoutButton from 'features/auth/components/LogoutButton';
import PlainLink from 'features/topnav/components/PlainLink';
import ProfileData from 'features/auth/components/ProfileData';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function Profile() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveUser());
    return () => dispatch(retrieveUser());
  }, [dispatch]);

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
        <Button variant="contained" color="secondary">
          <PlainLink to="/deq-to-eth">
            Exchange DEQ
          </PlainLink>
        </Button>
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
