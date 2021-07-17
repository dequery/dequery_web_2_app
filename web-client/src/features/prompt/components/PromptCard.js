import React from 'react';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PlainLink from 'features/topnav/components/PlainLink';
import WatcherButton from 'features/prompt/components/WatcherButton';


function PromptCard(props) {
  const { prompt } = props;

  return (
    <Card>
      <PlainLink to={`/prompts/${prompt.pk}`}>
        <CardContent>
          <Grid container alignItems="center" justify="space-between">
            <Typography variant="caption" gutterBottom>
              {prompt.bounty} DEQ
            </Typography>
            <WatcherButton prompt={prompt} />
          </Grid>
          <Typography color="textSecondary" gutterBottom>
            {prompt.user}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {prompt.title}
          </Typography>
          <Typography variant="body2" component="p" gutterbottom>
            {`Submission deadline ${moment(prompt.expiration_datetime).fromNow()}`}
          </Typography>
        </CardContent>
      </PlainLink>
    </Card>
  )
}

export default PromptCard;
