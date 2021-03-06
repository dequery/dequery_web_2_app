import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';

import { signup, selectIsFetching, selectRespError, selectUser, selectUserCreated, setPasswordMismatchError } from 'features/auth/authSlice';

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

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignupForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const userCreated = useSelector(selectUserCreated);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.non_field_errors;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();
  const query = useQuery();

  const onSubmitSignup = data => {
    if (data.password !== data.confirmPassword) {
      dispatch(setPasswordMismatchError());
    } else {
      delete data.confirmPassword;
      dispatch(signup(data));
    }
  };

  if (Object.keys(user) === 0) {
    return <Redirect to="/" />;
  }

  if (userCreated) {
    return <Redirect to="/login" />;
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
                  label="Display name"
                  helperText="The name other users will see, can be a pseudonym"
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
                  name="confirmPassword"
                  control={control}
                  inputId="confirmPassword"
                  fieldErrorMessage={respError.password}
                  label="Confirm Password"
                  rules={{
                    required: 'Required'
                  }}
                  type="password"
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  name="signupCode"
                  defaultValue={query.get('code')}
                  control={control}
                  inputId="signupCode"
                  fieldErrorMessage={respError.signup_code}
                  label="Signup code (optional)"
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
