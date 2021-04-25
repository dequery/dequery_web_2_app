import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Counter from './features/counter/Counter';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LoginForm from './features/auth/components/LoginForm';
// import Signup from './features/auth/components/Signup';
import Topnav from './features/topnav/components/Topnav';


const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: '40px',
  },
}));

//          <Route exact path="/signup" component={Signup} />

function App() {
  const classes = useStyles();

  return (
    <Router>
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
          <Route exact path="/" component={Counter} />
          <Redirect to="/" />
        </Switch>
      </Grid>
    </Router>
  );
}

export default App;
