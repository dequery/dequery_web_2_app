import React from 'react';
import MomentUtils from '@date-io/moment';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';


import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import About from 'features/about/components/About';
import CookieLogin from 'features/auth/components/CookieLogin';
import CreatePromptForm from 'features/prompt/components/CreatePromptForm';
import EthCashoutForm from 'features/profile/components/EthCashoutForm';
import ForgotPasswordForm from 'features/auth/components/ForgotPasswordForm';
import LoginForm from 'features/auth/components/LoginForm';
import PromptDetail from 'features/prompt/components/PromptDetail';
import PromptList from 'features/prompt/components/PromptList';
import Profile from 'features/profile/components/Profile';
import ResetPasswordForm from 'features/auth/components/ResetPasswordForm';
import SignupForm from 'features/auth/components/SignupForm';
import Topnav from 'features/topnav/components/Topnav';

import Grid from '@material-ui/core/Grid';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#517694',
      contrastText: '#fbf9f9',
    },
    secondary: {
      main: '#8697A5',
      contrastText: '#fbf9f9',
    },
    background: {
      default: '#F2EEEB',
      paper: '#fbf9f9'
    },
    text: {
      primary: '#181717',
    }
  },
});

const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: '40px',
  },
}));


function App() {
  const classes = useStyles();

  return (
    <Router>
      <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
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
            <Route exact path="/deq-to-eth" component={EthCashoutForm} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/forgot-password" component={ForgotPasswordForm} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/prompts/create" component={CreatePromptForm} />
            <Route exact path="/prompts/:promptPk" component={PromptDetail} />
            <Route exact path="/reset-password/:resetPasswordCode" component={ResetPasswordForm} />
            <Route exact path="/signup" component={SignupForm} />
            <Route exact path="/" component={PromptList} />
            <Redirect to="/" />
          </Switch>
        </Grid>
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
