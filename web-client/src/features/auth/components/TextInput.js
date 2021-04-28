import React from 'react';
import { Controller } from 'react-hook-form';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


function TextInput(props) {
  const hasError = (error) => {
    return !!(props.fieldErrorMessage || error);
  }

  const errorMessage = (error) => {
    if (error) {
      return error.message;
    } else if (props.fieldErrorMessage) {
      return props.fieldErrorMessage[0];
    }
    return null;
  }

  return (
    <FormControl fullWidth variant="filled">
      <Controller
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue || ''}
        render={({ field: { onChange, value }, fieldState: { error } }) =>
          <TextField
            id={props.inputId}
            error={hasError(error)}
            helperText={errorMessage(error)}
            fullWidth={true}
            variant="filled"
            value={value}
            onChange={onChange}
            label={props.label}
            type={props.type || 'string'}
          />
        }
        rules={props.rules}
      />
    </FormControl>
  );
}

export default TextInput;
