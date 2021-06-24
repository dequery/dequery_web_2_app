import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { selectPromptHiddenList } from 'features/prompt/promptSlice';
import { selectUser } from 'features/auth/authSlice';

import HiddenCodeForm from 'features/prompt/components/HiddenCodeForm';
import PlainLink from 'features/topnav/components/PlainLink';
import PromptCard from 'features/prompt/components/PromptCard';

import CreateIcon from '@material-ui/icons/Create';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  topButton: {
    marginRight: '10px',
    marginBottom: '10px',
  },
}));


function HiddenPromptList() {
  const classes = useStyles();
  const promptHiddenList = useSelector(selectPromptHiddenList);
  const user = useSelector(selectUser);

  return (
    <Container maxWidth="md" style={{flexGrow: 1}}>
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="flex-start"
        spacing={3}
      >
        <Grid item xs={2} md={1}>
          <PlainLink to='/prompts/create'>
            <Fab className={classes.topButton} disabled={Object.keys(user).length === 0} color="primary">
              <CreateIcon />
            </Fab>
          </PlainLink>
        </Grid>
        <Grid item xs={12} md={11}>
          <HiddenCodeForm />
        </Grid>
        {promptHiddenList.results.map((prompt, i) => {
          return (
            <Grid key={i} item xs={12}>
              <PromptCard prompt={prompt} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default HiddenPromptList;
