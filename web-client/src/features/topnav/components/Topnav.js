import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PlainLink from 'features/topnav/components/PlainLink';

import AuthNavButton from 'features/auth/components/AuthNavButton';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


function Topnav() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
        <Typography variant="h6" className={classes.title}>
          <PlainLink to="/">
            Dequery
          </PlainLink>
        </Typography>
      <AuthNavButton />
    </Toolbar>
  </AppBar>
  );
}

export default Topnav;
