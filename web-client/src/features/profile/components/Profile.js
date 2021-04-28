import React from 'react';

import LogoutButton from 'features/auth/components/LogoutButton';
import ProfileData from 'features/auth/components/ProfileData';

import Grid from '@material-ui/core/Grid';


function Profile() {
  return (
    <Grid>
      <ProfileData />
      <LogoutButton />
    </Grid>
  );
}

export default Profile;
