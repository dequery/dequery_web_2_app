import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addPromptWatcher, removePromptWatcher } from 'features/prompt/promptSlice';
import { selectUser } from 'features/auth/authSlice';

import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import PlainLink from 'features/topnav/components/PlainLink';


function WatcherButton(props) {
  const { prompt } = props;
  const user = useSelector(selectUser);
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
    <Typography display="inline" variant="body2" gutterbottom>
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
  )
}

export default WatcherButton;
