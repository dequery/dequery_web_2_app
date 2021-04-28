import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { signup, selectRespError, selectUser } from 'features/auth/authSlice';

import TextInput from 'features/auth/components/TextInput';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
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
      <form onSubmit={handleSubmit(onSubmitSignup)}>
        <Grid
          alignItems="center"
          container
          direction="row"
          justify="center"
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography align="center" variant="h2">Signup</Typography>
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

          <Grid item className={classes.centeredGrid} xs={12}>
            <Button variant="contained" color="primary" type="submit">
                Signup
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SignupForm;
