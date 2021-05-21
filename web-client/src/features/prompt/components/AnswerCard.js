import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import AnswerDetailContent from 'features/prompt/components/AnswerDetailContent';
import VoteCastForm from 'features/vote/components/VoteCastForm';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  topMargin: {
    marginTop: '10px',
  },
}));


function AnswerCard(props) {
  const classes = useStyles();
  const { answer } = props;

  return (
    <Card>
      <CardContent>
        <Typography variant="caption" gutterBottom>
          {answer.votes} Votes
        </Typography>
        <VoteCastForm answer={answer} />
        <Typography color="textSecondary" gutterBottom>
          {answer.user}
        </Typography>
        <AnswerDetailContent content={answer.content} />
        <Typography className={classes.topMargin} variant="body2" component="p">
          {`Created ${moment(answer.created).fromNow()}`}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default AnswerCard;
