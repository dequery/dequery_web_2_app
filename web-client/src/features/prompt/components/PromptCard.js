import React from 'react';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import PlainLink from 'features/topnav/components/PlainLink';


function PromptCard(props) {
  const { prompt } = props;

  return (
    <Card>
      <PlainLink to={`/prompts/${prompt.pk}`}>
        <CardContent>
          <Typography variant="caption" gutterBottom>
            {prompt.bounty} DEQ
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {prompt.user}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {prompt.title}
          </Typography>
          <Typography variant="body2" component="p">
            {`Submission deadline ${moment(prompt.expiration_datetime).fromNow()}`}
          </Typography>
        </CardContent>
      </PlainLink>
    </Card>
  )
}

export default PromptCard;
