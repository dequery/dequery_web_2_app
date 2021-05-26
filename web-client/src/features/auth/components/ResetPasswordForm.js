import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { resetPassword, selectIsFetching, selectRespError, selectUser, selectResetPasswordSuccess } from 'features/auth/authSlice';

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

function ResetPasswordForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const resetPasswordSuccess = useSelector(selectResetPasswordSuccess);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const { resetPasswordCode } = useParams()
  const { handleSubmit, control } = useForm();

  const onSubmit = (data, resetPasswordCode) => {
    data.resetPasswordCode = resetPasswordCode;
    dispatch(resetPassword(data));
  };

  if (user.pk) {
    return <Redirect to="/" />;
  }

  if (resetPasswordSuccess) {
    return <Redirect to="/login" />;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit((data) => onSubmit(data, resetPasswordCode))}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Reset Password</Typography>
              </Grid>

              {nonFieldError && (
                <Grid item xs={12}>
                  <Alert severity="error">{nonFieldError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextInput
                  name="newPassword"
                  control={control}
                  inputId="newPassword"
                  fieldErrorMessage={respError.new_password}
                  label="New Password"
                  rules={{
                    required: 'Required'
                  }}
                  type="password"
                />
              </Grid>

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ResetPasswordForm;