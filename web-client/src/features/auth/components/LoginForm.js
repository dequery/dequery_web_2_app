import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { login, selectUser } from '../authSlice';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


function LoginForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { handleSubmit, control, errors: fieldsErrors, reset } = useForm();
  const [generalLoginError, setGeneralLoginError] = useState('');
  console.log('hi');

  const onSubmitLogin = data => {
    console.log('submitting');
    console.log(data);
    dispatch(login(data));
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Grid
      alignItems="center"
      container
      direction="row"
      justify="center"
    >
      <form onSubmit={handleSubmit(onSubmitLogin)}>
        <FormControl fullWidth variant="outlined">
          <Controller
            name="displayName"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) =>
              <TextField
                id="displayName"
                variant="outlined"
                value={value}
                onChange={onChange}
                label="Display Name"
              />
            }
            rules={{
              required: 'Required'
            }}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <Controller
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) =>
              <TextField
                id="password"
                type="password"
                value={value}
                onChange={onChange}
                variant="outlined"
                label="Password"
              />
            }
            control={control}
            defaultValue=""
            rules={{
              required: 'Required'
            }}
          />
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
            Login
        </Button>
      </form>
    </Grid>
  );
}

export default LoginForm;
