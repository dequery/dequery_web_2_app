import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import CookieLogin from 'features/auth/components/CookieLogin';
import CreatePromptForm from 'features/prompt/components/CreatePromptForm';
import ListPrompts from 'features/prompt/components/ListPrompts';
import LoginForm from 'features/auth/components/LoginForm';
import SignupForm from 'features/auth/components/SignupForm';
import Profile from 'features/profile/components/Profile';
import Topnav from 'features/topnav/components/Topnav';

import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: '40px',
  },
}));


function App() {
  const classes = useStyles();

  return (
    <Router>
      <CookieLogin />
      <CssBaseline />
      <Topnav />
      <Grid
        container
        className={classes.main}
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/signup" component={SignupForm} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/prompt/create" component={CreatePromptForm} />
          <Route exact path="/" component={ListPrompts} />
          <Redirect to="/" />
        </Switch>
      </Grid>
    </Router>
  );
}

export default App;
