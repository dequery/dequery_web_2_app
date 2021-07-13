import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { EditorState, convertToRaw } from 'draft-js';

import { createPrompt, selectIsFetching, selectRespError, selectPromptCreated } from 'features/prompt/promptSlice';
import { retrieveUser } from 'features/auth/authSlice';

import AuthRedirect from 'features/auth/components/AuthRedirect';
import PromptEditor from 'features/prompt/components/PromptEditor';
import TextInput from 'features/auth/components/TextInput';

import { DateTimePicker } from "@material-ui/pickers";
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
  const [expirationDatetime, handleDateChange] = useState(null);

  useEffect(() => {
    dispatch(retrieveUser());
    return () => dispatch(retrieveUser());
  }, [dispatch])

  const onSubmitCreate = (data, editorState) => {
    data.content = convertToRaw(editorState.getCurrentContent());
    data.expirationDatetime = expirationDatetime;
    dispatch(createPrompt(data));
  };

  if (promptCreated.pk) {
    return <Redirect to={`/prompts/${promptCreated.pk}`} />;
  }

  return (
    <Container maxWidth="md">
      <AuthRedirect />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit((data) => onSubmitCreate(data, editorState))}>
            <Grid
              alignItems="top"
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
                  label="Title"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <DateTimePicker
                  label="Expiration Datetime"
                  inputVariant="outlined"
                  value={expirationDatetime}
                  onChange={handleDateChange}
                  fullWidth={true}
                  disablePast={true}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextInput
                  name="bounty"
                  control={control}
                  inputId="bounty"
                  fieldErrorMessage={respError.bounty}
                  label="Bounty"
                  type="number"
                  rules={{
                    required: 'Required'
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextInput
                  name="askersCut"
                  control={control}
                  inputId="askersCut"
                  fieldErrorMessage={respError.askers_cut}
                  label="Askers cut"
                  type="number"
                  defaultValue={0.1}
                  helperText="Cut earned when another user adds to prompt's bounty (0 to 1)"
                />
              </Grid>

              {/*<Grid item xs={12} md={4}>
                <TextInput
                  name="hiddenCode"
                  control={control}
                  inputId="hiddenCode"
                  fieldErrorMessage={respError.hidden_code}
                  label="Hidden code (optional)"
                  helperText="Optional code used to hide prompt from public"
                />
                </Grid>*/}

              <Grid item xs={12}>
                <PromptEditor onEditorStateChange={setEditorState} editorState={editorState} />
              </Grid>

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
