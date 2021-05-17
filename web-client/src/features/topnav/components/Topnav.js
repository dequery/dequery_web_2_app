import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AuthNavButton from 'features/auth/components/AuthNavButton';
import PlainLink from 'features/topnav/components/PlainLink';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  plainAnchor: {
    color: 'inherit',
    textDecoration: 'none',
  }
}));


function Topnav() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <PlainLink to="/"><MenuItem onClick={handleClose}>Home</MenuItem></PlainLink>
          <PlainLink to="/about"><MenuItem onClick={handleClose}>About</MenuItem></PlainLink>
          <MenuItem><a className={classes.plainAnchor} href="https://docs.google.com/document/d/1VsMbWJxPcDNJFNSEdHfKyL9v8WREks9d5t0Ot_7maPs/edit">Whitepaper</a></MenuItem>
          <PlainLink to="/profile"><MenuItem onClick={handleClose}>Profile</MenuItem></PlainLink>
        </Menu>
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
