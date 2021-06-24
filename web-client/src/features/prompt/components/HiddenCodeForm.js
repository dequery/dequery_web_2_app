import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { listHiddenPrompts, selectIsFetchingHiddenList, selectRespErrorHiddenList } from 'features/prompt/promptSlice';


import TextInput from 'features/auth/components/TextInput';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'


function HiddenCodeForm() {
  const dispatch = useDispatch();
  const isFetchingHiddenList = useSelector(selectIsFetchingHiddenList);
  const respErrorHiddenList = useSelector(selectRespErrorHiddenList);
  const nonFieldError = respErrorHiddenList.detail;
  const { handleSubmit, control } = useForm();

  const onSubmit = data => {
    dispatch(listHiddenPrompts(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="flex-start"
        spacing={1}
      >
        {nonFieldError && (
          <Grid item xs={12}>
            <Alert severity="error">{nonFieldError}</Alert>
          </Grid>
        )}

        <Grid item xs={9} md={5}>
          <TextInput
            name="hiddenCode"
            control={control}
            inputId="hiddenCode"
            fieldErrorMessage={respErrorHiddenList.hidden_code}
            label="Code"
            rules={{
              required: 'Required'
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <Button disabled={isFetchingHiddenList} variant="contained" color="primary" type="submit">
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default HiddenCodeForm;
