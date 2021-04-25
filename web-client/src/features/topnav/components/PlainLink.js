import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  plain: {
    color: 'inherit',
    textDecoration: 'inherit',
    fontSize: 'inherit',
  },
}));


function PlainLink(props) {
  const classes = useStyles();

  return (
    <Link className={classes.plain} to={props.to}>{props.children}</Link>
  )
}

export default PlainLink;
