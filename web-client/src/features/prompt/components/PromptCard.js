import React from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { addPromptWatcher, removePromptWatcher } from 'features/prompt/promptSlice';

import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import PlainLink from 'features/topnav/components/PlainLink';


function PromptCard(props) {
  const { prompt, user } = props;
  const watchers_count = prompt.watchers.length;
  const dispatch = useDispatch();

  const handleWatchClick = (e, prompt) => {
    e.preventDefault();
    if (prompt.watchers.filter(w => w.user.display_name === user.display_name).length > 0) {
      const promptWatcher = prompt.watchers.find(watcher => watcher.user.display_name === user.display_name);
      dispatch(removePromptWatcher({ promptWatcher: promptWatcher.pk }));
    } else {
      dispatch(addPromptWatcher({ prompt: prompt.pk }));
    }
  }

  const watchButtonColor = (watchers) => {
    if (!user.pk) {
      return "secondary";
    }

    if (watchers.filter(w => w.user.display_name === user.display_name).length > 0) {
      return "primary";
    }
    return "secondary";
  }

  return (
    <Card>
      <PlainLink to={`/prompts/${prompt.pk}`}>
        <CardContent>
          <Grid container alignItems="center" justify="space-between">
            <Typography variant="caption" gutterBottom>
              {prompt.bounty} DEQ
            </Typography>
            <Typography variant="body2" gutterbottom>
              {user.pk ?
                (
                  <Tooltip title="Watch prompt. Will send notifications when another user submits an answer and when prompt is about to expire.">
                    <IconButton onClick={(e) => handleWatchClick(e, prompt)} color={watchButtonColor(prompt.watchers)}><AlarmOnIcon /></IconButton>
                  </Tooltip>
                ) :
                (
                  <PlainLink to='/login'>
                    <IconButton disabled={true} color={watchButtonColor(prompt.watchers)}><AlarmOnIcon /></IconButton>
                  </PlainLink>
                )
              }
              {watchers_count}
            </Typography>
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
