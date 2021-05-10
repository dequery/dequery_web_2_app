import React from 'react';

import AuthRedirect from 'features/auth/components/AuthRedirect';
import LogoutButton from 'features/auth/components/LogoutButton';
import ProfileData from 'features/auth/components/ProfileData';

import Grid from '@material-ui/core/Grid';


function Profile() {
  return (
    <Grid>
      <AuthRedirect />
      <ProfileData />
      <LogoutButton />
    </Grid>
  );
}

export default Profile;
