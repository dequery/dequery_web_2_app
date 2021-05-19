import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { EditorState, convertToRaw } from 'draft-js';

import { createPrompt, selectIsFetching, selectRespError, selectPromptCreated } from 'features/prompt/promptSlice';

import AuthRedirect from 'features/auth/components/AuthRedirect';
import PromptEditor from 'features/prompt/components/PromptEditor';
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

function CreatePromptForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const promptCreated = useSelector(selectPromptCreated);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const { handleSubmit, control } = useForm();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onSubmitCreate = (data, editorState) => {
    data.content = convertToRaw(editorState.getCurrentContent());
    dispatch(createPrompt(data));
  };

  if (promptCreated.id) {
    return <Redirect to={`/prompts/${promptCreated.id}`} />;
  }

  return (
    <Container maxWidth="md">
      <AuthRedirect />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit( (data) => onSubmitCreate(data, editorState))}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Create Prompt</Typography>
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
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  name="bounty"
                  control={control}
                  inputId="bounty"
                  fieldErrorMessage={respError.bounty}
                  label="bounty"
                  type="number"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <PromptEditor onEditorStateChange={setEditorState} editorState={editorState} />

              <Grid item className={classes.centeredGrid} xs={12}>
                <Button disabled={isFetching} variant="contained" color="primary" type="submit">
                    Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CreatePromptForm;
