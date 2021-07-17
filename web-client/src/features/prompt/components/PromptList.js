import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { clearPromptList, listPrompts, selectPromptList } from 'features/prompt/promptSlice';
import { selectUser } from 'features/auth/authSlice';

import PlainLink from 'features/topnav/components/PlainLink';
import PromptCard from 'features/prompt/components/PromptCard';

import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  topButton: {
    marginRight: '10px',
    marginBottom: '10px',
  },
}));


function PromptList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const promptList = useSelector(selectPromptList);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(listPrompts());
    return () => dispatch(clearPromptList());
  }, [dispatch]);

  return (
    <Container maxWidth="md" style={{flexGrow: 1}}>
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <PlainLink to='/prompts/create'>
            <Fab className={classes.topButton} disabled={Object.keys(user).length === 0} color="primary">
              <CreateIcon />
            </Fab>
          </PlainLink>

          <PlainLink to='/about'>
            <Button className={classes.topButton} color="secondary" variant="contained">Learn More</Button>
          </PlainLink>
        </Grid>
        {promptList.results.map((prompt, i) => {
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

export default PromptList;
