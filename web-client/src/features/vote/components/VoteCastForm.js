import React from 'react';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { selectUser } from 'features/auth/authSlice';
import { createVoteCast, selectVoteBalanceList, selectRespErrorCreate, selectIsFetching } from 'features/vote/voteSlice';

import TextInput from 'features/auth/components/TextInput';

import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function VoteCastForm(props) {
  const dispatch = useDispatch();
  const { answer } = props;
  const isFetching = useSelector(selectIsFetching);
  const user = useSelector(selectUser);
  const voteBalanceList = useSelector(selectVoteBalanceList);
  const respErrorCreate = useSelector(selectRespErrorCreate);
  const nonFieldError = respErrorCreate.detail;
  const classes = useStyles();
  const { handleSubmit, control } = useForm();
  const disabled = Boolean(!user || isFetching);

  const onVoteSubmit = (data, voteBalanceList, answer) => {
    data.vote_balance = voteBalanceList.results[0].pk;
    data.answer = answer.pk;
    dispatch(createVoteCast(data));
  };

  return (
    <form onSubmit={handleSubmit((data) => onVoteSubmit(data, voteBalanceList, answer))}>
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="flex-start"
        spacing={3}
      >
        <Grid item xs={3}>
          <TextInput
            name="amount"
            control={control}
            disabled={disabled}
            inputId="amount"
            fieldErrorMessage={respErrorCreate.amount}
            label="Amount"
            type="number"
            rules={{
              required: 'Required'
            }}
          />
        </Grid>

        <Grid item className={classes.centeredGrid} xs={1}>
          <Button disabled={disabled} variant="contained" color="primary" type="submit">
              Add
          </Button>
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

export default VoteCastForm;
