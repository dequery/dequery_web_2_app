import React from 'react';
import { useSelector } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';

import PlainLink from 'features/topnav/components/PlainLink';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
        <Card>
          <CardContent>
            <Typography>
              Display name: {user.display_name}
            </Typography>
            <Typography>
              Email: {user.email}
            </Typography>
            <Typography>
              ETH Wallet: {user.eth_address}
            </Typography>
            <Typography>
              Web link: <a href={user.web_link} target="_blank">{user.web_link}</a>
            </Typography>
          </CardContent>
          <CardActions style={{textAlign: 'center'}}>
            <Grid item xs={12}>
              <PlainLink to="/edit-profile">
                <Button variant="contained" color="secondary">
                    Edit
                </Button>
              </PlainLink>
            </Grid>
          </CardActions>
        </Card>
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
