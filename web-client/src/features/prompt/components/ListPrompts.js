import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import PlainLink from 'features/topnav/components/PlainLink';

import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  centeredGrid: {
    textAlign: 'center',
  },
}));

function ListPrompts() {
  const dispatch = useDispatch();
  const classes = useStyles();


  return (
    <Container maxWidth="sm">
      <PlainLink to='/prompt/create'>Create Prompt</PlainLink>
      List Prompts Here
    </Container>
  );
}

export default ListPrompts;
