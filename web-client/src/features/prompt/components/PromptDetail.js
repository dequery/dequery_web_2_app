import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { selectVoteCastCreated } from 'features/vote/voteSlice';
import { clearPromptCreated, clearPromptDetail, retrievePrompt, selectIsFetching, selectPromptDetail } from 'features/prompt/promptSlice';

import AnswerAccordion from 'features/prompt/components/AnswerAccordion';
import AnswerCard from 'features/prompt/components/AnswerCard';
import PromptDetailContent from 'features/prompt/components/PromptDetailContent';
import VoteBalanceDisplay from 'features/vote/components/VoteBalanceDisplay';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: '10px',
  },
}));


function PromptDetail(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { promptPk } = useParams();
  const prompt = useSelector(selectPromptDetail);
  const isFetching = useSelector(selectIsFetching);
  const voteCastCreated = useSelector(selectVoteCastCreated);

  useEffect(() => {
    dispatch(clearPromptCreated());
    dispatch(retrievePrompt(promptPk));
    return () => dispatch(clearPromptDetail());
  }, [dispatch, promptPk, voteCastCreated]);

  if (isFetching || Object.keys(prompt).length === 0) {
    return <LinearProgress />;
  } 

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
          <Card>
            <CardContent>
              <Grid container alignItems="center" justify="space-between">
                <Grid item xs={6}>
                  <Typography display="inline" variant="caption" gutterBottom>
                    {prompt.bounty} DEQ
                  </Typography>
                </Grid>
                <Grid item style={{textAlign: 'right'}} xs={6}>
                  <VoteBalanceDisplay prompt={prompt} />
                </Grid>
              </Grid>
              <Typography color="textSecondary" gutterBottom>
                {prompt.user}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {prompt.title}
              </Typography>
              <PromptDetailContent content={prompt.content} />
              <Typography className={classes.topMargin} variant="body2" component="p">
                {`Submission deadline ${moment(prompt.expiration_datetime).fromNow()}`}
              </Typography>
            </CardContent>
          </Card>
          <AnswerAccordion promptPk={prompt.pk} />
        </Grid>
        {prompt.answers.map((answer, i) => {
          return (
            <Grid key={i} item xs={12}>
              <AnswerCard answer={answer} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default PromptDetail;
