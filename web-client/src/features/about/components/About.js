import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


function About() {
  return (
    <Container maxWidth="md">
      <Grid
        alignItems="top"
        container
        direction="row"
        justify="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <Typography align="center" variant="h1" gutterbottom>
            Dequery
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h2" gutterbottom>
            Where Exploration Meets Tokenomics
          </Typography>
          <Typography align="center" variant="h3" gutterbottom>
            How Dequery coin (DEQ) works
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{minHeight: '330px'}}>
            <CardContent>
              <Typography variant="h4">
                1. Spend DEQ to put a bounty on your questions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{minHeight: '330px'}}>
            <CardContent>
              <Typography variant="h4">
                2. Earn DEQ by asking popular questions or providing upvoted answers.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{minHeight: '330px'}}>
            <CardContent>
              <Typography variant="h4">
                3. Trade, Sell, or Buy DEQ anywhere in the Blockchain Universe that interacts with ERC-20 tokens.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
