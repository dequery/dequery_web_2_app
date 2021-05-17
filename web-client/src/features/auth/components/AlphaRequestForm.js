import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { submitAlphaRequest, selectIsFetching, selectRespError, selectAlphaRequestSuccess } from 'features/auth/authSlice';

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

function AlphaRequestForm() {
  const dispatch = useDispatch();
  const alphaRequestSuccess = useSelector(selectAlphaRequestSuccess);
  const isFetching = useSelector(selectIsFetching);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmitAlphaRequest = data => {
    dispatch(submitAlphaRequest(data));
  };

  if (alphaRequestSuccess) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitAlphaRequest)}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Request Alpha Access</Typography>
              </Grid>

              {nonFieldError && (
                <Grid item xs={12}>
                  <Alert severity="error">{nonFieldError}</Alert>
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

              <Grid item xs={12}>
                <TextInput
                  name="text"
                  control={control}
                  inputId="text"
                  fieldErrorMessage={respError.text}
                  label="Message (640 char max)"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AlphaRequestForm;
