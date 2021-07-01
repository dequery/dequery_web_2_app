import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { forgotPassword, selectUser, selectRespError, selectIsFetching, selectForgotPasswordSuccess } from 'features/auth/authSlice';

import CookieLogin from 'features/auth/components/CookieLogin';
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

function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const forgotPasswordSuccess = useSelector(selectForgotPasswordSuccess);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.non_field_errors;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmitLogin = data => {
    dispatch(forgotPassword(data));
  };

  if (user.pk) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <CookieLogin />
      <Card>
        <CardContent>
          {!forgotPasswordSuccess && (
            <form onSubmit={handleSubmit(onSubmitLogin)}>
              <Grid
                alignItems="center"
                container
                direction="row"
                justify="center"
                spacing={3}
              >
                <Grid item xs={12}>
                  <Typography align="center" variant="h3">Forgot Password</Typography>
                </Grid>

                {nonFieldError && (
                  <Grid item xs={12}>
                    <Alert severity="error">{nonFieldError[0]}</Alert>
                  </Grid>
                )}

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

                <Grid item className={classes.centeredGrid} xs={12}>
                  <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                      Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {forgotPasswordSuccess && (
            <Grid item xs={12}>
              <Typography align="center" variant="body1">If an account with the submitted email exists, you will receive a reset password link. Please contact info@dequery.org if you continue to have login problems.</Typography>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ForgotPasswordForm;
