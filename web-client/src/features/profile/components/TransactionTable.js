import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { listTransactions, selectTransactionList } from 'features/profile/profileSlice';

import PlainLink from 'features/topnav/components/PlainLink';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


function TransactionTable(props) {
  const dispatch = useDispatch()
  const transactionList = useSelector(selectTransactionList);
  const transactions = transactionList.results || [];

  useEffect(() => {
    dispatch(listTransactions());
    return () => dispatch(listTransactions());
  }, [dispatch]);

  const renderAmount = (transaction) => {
    const spending_categories = ['to_eth', 'to_prompt_bounty'];
    const amount = Number.parseFloat(transaction.amount).toFixed(4);
    if (spending_categories.includes(transaction.category)) {
      return `-${amount}`;
    }
    return `${amount}`;
  }

  const renderCreated = (transaction) => {
    return moment(transaction.created).fromNow();
  }

  const renderCategory = (transaction) => {
    const display_mapping = {
      from_answer: 'From upvoted answer',
      from_prompt_added_bounty: 'From prompt bounty increase',
      from_source: 'Gifted',
      from_expired_prompt: 'Refund from unanswered prompt',
      to_eth: 'Cashed out for ETH',
      to_prompt_bounty: 'To prompt bounty'
    }
    return display_mapping[transaction.category];
  }

  const renderData = (transaction) => {
    if (['from_answer', 'from_prompt_added_bounty', 'from_expired_prompt', 'to_prompt_bounty'].includes(transaction.category)) {
      const promptPk = transaction.extra_info['prompt'];
      return (
        <PlainLink to={`/prompts/${promptPk}`}>Prompt {promptPk}</PlainLink>
      );
    }
    return '';
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Data</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.name}>
              <TableCell component="th" scope="row">
                {renderAmount(transaction)}
              </TableCell>
              <TableCell>{renderCategory(transaction)}</TableCell>
              <TableCell>{renderData(transaction)}</TableCell>
              <TableCell align="right">{renderCreated(transaction)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TransactionTable;
