import React, { useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { listTransactions, selectTransactionList } from 'features/profile/profileSlice';

import { Link } from 'react-router-dom';
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
        <Link to={`/prompts/${promptPk}`}>Prompt {promptPk}</Link>
      );
    } else if (transaction.category === 'to_eth') {
      const showTransactionLink = transaction.extra_info && transaction.extra_info.tx_hash;
      return (
        <div>
          <a href={`https://etherscan.io/address/${transaction.extra_info.ethereum_address}`}>Deposit Address</a>
          <div/>
          {showTransactionLink && <a href={`https://etherscan.io/tx/${transaction.extra_info.tx_hash}`}>Tx Hash</a>}
        </div>
      );
    }
    return '';
  }

  return (
    <TableContainer style={{width: '100%'}} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Data</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.pk}>
              <TableCell component="th" scope="row">
                {renderAmount(transaction)}
              </TableCell>
              <TableCell>{transaction.status.toUpperCase()}</TableCell>
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
