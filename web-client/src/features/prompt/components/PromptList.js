import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { clearPromptList, listPrompts, selectPromptList } from 'features/prompt/promptSlice';
import { selectUser } from 'features/auth/authSlice';

import PlainLink from 'features/topnav/components/PlainLink';
import PromptCard from 'features/prompt/components/PromptCard';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


function PromptList() {
  const dispatch = useDispatch();
  const promptList = useSelector(selectPromptList);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(listPrompts());
    return () => dispatch(clearPromptList());
  }, [dispatch]);

  return (
    <Container maxWidth="md">
      <Grid
        alignItems="center"
        container
        direction="row"
        justify="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <PlainLink to='/prompts/create'>
            <Button disabled={Object.keys(user).length === 0} variant="contained" color="primary">Create Prompt</Button>
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
