import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { selectIsFetchingUpdateUser, selectRespErrorUpdateUser, selectUser, updateUser } from 'features/auth/authSlice';

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

function EditProfileForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetchingUpdateUser);
  const user = useSelector(selectUser);
  const respError = useSelector(selectRespErrorUpdateUser);
  const nonFieldError = respError.non_field_errors;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmit = (data, userPk) => {
    data.userPk = userPk;
    dispatch(updateUser(data));
  };

  if (!user.pk) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(data => onSubmit(data, user.pk))}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Update Profile</Typography>
              </Grid>

              {nonFieldError && (
                <Grid item xs={12}>
                  <Alert severity="error">{nonFieldError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextInput
                  name="displayName"
                  defaultValue={user.display_name}
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
                  defaultValue={user.email}
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
                  name="ethAddress"
                  defaultValue={user.eth_address}
                  control={control}
                  inputId="ethAddress"
                  fieldErrorMessage={respError.eth_address}
                  label="Eth Address"
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  name="webLink"
                  defaultValue={user.web_link}
                  control={control}
                  inputId="webLink"
                  fieldErrorMessage={respError.web_link}
                  label="Web Link"
                />
              </Grid>

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default EditProfileForm;
