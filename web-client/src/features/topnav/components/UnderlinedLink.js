import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  underlined: {
    color: theme.palette.primary.main,
    textDecoration: `underline {theme.palette.primary.main}`,
    fontSize: 'inherit',
  },
}));


function UnderlinedLink(props) {
  const classes = useStyles();

  return (
    <Link className={classes.underlined} to={props.to}>{props.children}</Link>
  )
}

export default UnderlinedLink;
