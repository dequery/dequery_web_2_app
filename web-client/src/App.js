import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import About from 'features/about/components/About';
import AlphaRequestForm from 'features/auth/components/AlphaRequestForm';
import CookieLogin from 'features/auth/components/CookieLogin';
import CreatePromptForm from 'features/prompt/components/CreatePromptForm';
import LoginForm from 'features/auth/components/LoginForm';
import PromptDetail from 'features/prompt/components/PromptDetail';
import PromptList from 'features/prompt/components/PromptList';
import Profile from 'features/profile/components/Profile';
import SignupForm from 'features/auth/components/SignupForm';
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
          <Route exact path="/about" component={About} />
          <Route exact path="/alpharequest" component={AlphaRequestForm} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/prompts/create" component={CreatePromptForm} />
          <Route exact path="/prompts/:promptId" component={PromptDetail} />
          <Route exact path="/signup" component={SignupForm} />
          <Route exact path="/" component={PromptList} />
          <Redirect to="/" />
        </Switch>
      </Grid>
    </Router>
  );
}

export default App;
