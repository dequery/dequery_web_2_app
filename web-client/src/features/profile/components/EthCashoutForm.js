import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { clearTransactionCreated, createTransaction, selectTransactionCreated, selectIsFetching, selectRespError } from 'features/profile/profileSlice';

import AuthRedirect from 'features/auth/components/AuthRedirect';
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

function EthCashoutForm() {
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsFetching);
  const respError = useSelector(selectRespError);
  const nonFieldError = respError.detail;
  const classes = useStyles();
  const transactionCreated = useSelector(selectTransactionCreated);
  const { handleSubmit, control } = useForm();

  useEffect(() => {
    dispatch(clearTransactionCreated());
    return () => dispatch(clearTransactionCreated());
  }, [dispatch]);

  if (transactionCreated) {
    return <Redirect to="/profile" />;
  }

  const onSubmit = data => {
    const formattedData = {};
    formattedData.extra_info = { ethereum_address: data.ethereumAddress };
    formattedData.amount = data.amount;
    formattedData.category = 'to_eth';
    dispatch(createTransaction(formattedData));
  };

  return (
    <Container maxWidth="sm">
      <AuthRedirect />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              alignItems="center"
              container
              direction="row"
              justify="center"
              spacing={3}
            >
              <Grid item xs={12}>
                <Typography align="center" variant="h3">Convert DEQ Earnings</Typography>
              </Grid>

              {nonFieldError && (
                <Grid item xs={12}>
                  <Alert severity="error">{nonFieldError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextInput
                  name="amount"
                  control={control}
                  inputId="amount"
                  fieldErrorMessage={respError.amount}
                  label="Amount of DEQ to exchange for ETH"
                  rules={{
                    required: 'Required'
                  }}
                  type="number"
                />
              </Grid>

              <Grid item xs={12}>
                <TextInput
                  name="ethereumAddress"
                  control={control}
                  inputId="ethereumAddress"
                  fieldErrorMessage={respError.extra_data}
                  helperText="eg. 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
                  label="Public Ethereum Address"
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
        </CardContent>
      </Card>
    </Container>
  );
}

export default EthCashoutForm;
