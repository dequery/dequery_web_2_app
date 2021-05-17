import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { signup, selectIsFetching, selectRespError, selectUser } from 'features/auth/authSlice';

import PlainLink from 'features/topnav/components/PlainLink';
import TextInput from 'features/auth/components/TextInput';

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

function SignupForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmitSignup = data => {
    dispatch(signup(data));
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitSignup)}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Signup</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography align="center" variant="body1">
                  <PlainLink to="/alpharequest">Request Alpha Passcode</PlainLink>
                </Typography>
              </Grid>

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
                  name="email"
                  control={control}
                  inputId="email"
                  fieldErrorMessage={respError.email}
                  label="Email"
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

              <Grid item xs={12}>
                <TextInput
                  name="alphaPasscode"
                  control={control}
                  inputId="alphaPasscode"
                  fieldErrorMessage={respError.alpha_passcode}
                  label="Alpha Passcode"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Signup
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignupForm;
