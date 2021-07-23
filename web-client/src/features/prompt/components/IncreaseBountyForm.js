import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { selectUser } from 'features/auth/authSlice';
import { increasePromptBounty, selectIncreaseBountyRespError, selectIsFetching } from 'features/prompt/promptSlice';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip';

import TextInput from 'features/auth/components/TextInput';


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function IncreaseBountyForm(props) {
  const dispatch = useDispatch();
  const { prompt } = props;
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const increaseBountyRespError = useSelector(selectIncreaseBountyRespError);
  const nonFieldError = increaseBountyRespError.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();
  const disabled = Boolean(!user.pk || isFetching);

  const onSubmit = (data, prompt) => {
    data.extraInfo = { prompt: prompt.pk }
    dispatch(increasePromptBounty(data));
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, prompt))}>
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="flex-start"
        spacing={3}
      >
        <Grid item xs={6} sm={3}>
          <TextInput
            name="amount"
            control={control}
            disabled={disabled}
            inputId="amount"
            fieldErrorMessage={increaseBountyRespError.amount}
            label="DEQ Amount"
            type="number"
            rules={{
              required: 'Required'
            }}
          />
        </Grid>

        <Grid item className={classes.centeredGrid} xs={6} sm={3}>
          <Tooltip title="Adding to this bounty will give you an equal amount of upvotes to use on answers to this question.">
            <Button disabled={disabled} variant="contained" color="primary" type="submit">
                Add Bounty
            </Button>
          </Tooltip>
        </Grid>

        <Grid item className={classes.centeredGrid} xs={4}>
          {nonFieldError && (
            <Grid item xs={12}>
                <Alert severity="error">{nonFieldError}</Alert>
            </Grid>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default IncreaseBountyForm;
