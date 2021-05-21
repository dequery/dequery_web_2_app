import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectUser } from 'features/auth/authSlice';
import { clearVoteBalanceList, listVoteBalances, selectVoteBalanceList, selectVoteCastCreated } from 'features/vote/voteSlice';

import Typography from '@material-ui/core/Typography';


function VoteBalance(props) {
  const dispatch = useDispatch();
  const { prompt } = props;
  const user = useSelector(selectUser);
  const voteCastCreated = useSelector(selectVoteCastCreated);
  const voteBalanceList = useSelector(selectVoteBalanceList);
  const voteBalanceTotal = voteBalanceList.results.reduce((total, voteBalance) => voteBalance.remaining_amount + total, 0);

  useEffect(() => {
    dispatch(listVoteBalances({ promptPk: prompt.pk }));
    return () => dispatch(clearVoteBalanceList());
  }, [dispatch, voteCastCreated]);

  if (user) {
    return (
      <Typography align="right" variant="caption" gutterBottom>
        {voteBalanceTotal} available vote tokens for this question
      </Typography>
    );
  }

  return (
    <div/>
  );
}

export default VoteBalance;
