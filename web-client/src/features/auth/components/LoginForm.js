import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { login, selectIsFetching, selectRespError, selectUser, selectUserCreated } from 'features/auth/authSlice';

import CookieLogin from 'features/auth/components/CookieLogin';
import TextInput from 'features/auth/components/TextInput';
import UnderlinedLink from 'features/topnav/components/UnderlinedLink';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function LoginForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const userCreated = useSelector(selectUserCreated);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmitLogin = data => {
    dispatch(login(data));
  };

  if (user.pk) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <CookieLogin />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitLogin)}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Login</Typography>
              </Grid>

              {userCreated && <Grid item xs={12}>
                <Typography align="center" variant="body1">Your account was created, please login</Typography>
              </Grid>}

              {nonFieldError && (
                <Grid item xs={12}>
                  <Alert severity="error">{nonFieldError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextInput
                  name="displayName"
                  control={control}
                  inputId="displayName"
                  fieldErrorMessage={respError.display_name}
                  label="Display Name"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  name="password"
                  control={control}
                  inputId="password"
                  fieldErrorMessage={respError.password}
                  label="Password"
                  rules={{
                    required: 'Required'
                  }}
                  type="password"
                />
              </Grid>

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Login
                </Button>
              </Grid>

              <Grid className={classes.centeredGrid} item xs={12}>
                <UnderlinedLink to='/forgot-password'>
                  <Typography variant="body1">Forgot Password</Typography>
                </UnderlinedLink>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginForm;
