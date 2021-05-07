import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { createPrompt, selectRespError, selectPromptCreated } from 'features/prompt/promptSlice';

import AuthRedirect from 'features/auth/components/AuthRedirect';
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

function CreatePromptForm() {
  const dispatch = useDispatch();
  const promptCreated = useSelector(selectPromptCreated);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmitCreate = data => {
    dispatch(createPrompt(data));
  };

  if (promptCreated.pk) {
    console.log('now we should go to prompt detail')
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="sm">
      <AuthRedirect />
      <form onSubmit={handleSubmit(onSubmitCreate)}>
        <Grid
          alignItems="center"
          container
          direction="row"
          justify="center"
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography align="center" variant="h2">Create Prompt</Typography>
          </Grid>

          {nonFieldError && (
            <Grid item xs={12}>
              <Alert severity="error">{nonFieldError}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextInput
              name="title"
              control={control}
              inputId="title"
              fieldErrorMessage={respError.title}
              label="title"
              rules={{
                required: 'Required'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              name="expirationDatetime"
              control={control}
              inputId="expirationDatetime"
              fieldErrorMessage={respError.expiration_datetime}
              label="Expiration Datetime"
              rules={{
                required: 'Required'
              }}
              type="datetime-local"
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              name="content"
              control={control}
              inputId="content"
              fieldErrorMessage={respError.content}
              label="Content"
              rules={{
                required: 'Required'
              }}
            />
          </Grid>

          <Grid item className={classes.centeredGrid} xs={12}>
            <Button variant="contained" color="primary" type="submit">
                Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default CreatePromptForm;
