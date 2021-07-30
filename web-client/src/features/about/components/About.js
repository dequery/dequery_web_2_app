import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  heroCard: {
    backgroundColor: 'black',
  },
  heroText: {
    color: '#b3bec6',
    marginTop: '20px',
  },
  fullContainer: {
    backgroundColor: 'black',
    boxSizing: 'border-box',
    marginTop: '-40px',
    paddingBottom: '40px',
    marginBottom: '-20px',
    minWidth: '100vw',
    minHeight: '100vh',
  },
}));


function About() {
  const classes = useStyles();

  return (
    <Container className={classes.fullContainer}>
      <Grid
        alignItems="top"
        container
        direction="row"
        justify="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <Card className={classes.heroCard}>
            <CardMedia
              image={`${process.env.PUBLIC_URL}/dequery_background.png`}
              style={{minHeight: '680px'}}
            />
            <CardContent>
              <Typography color='secondary' align="center" variant="h2" gutterbottom>
                Don't go down the rabbit hole alone
              </Typography>
              <Typography className={classes.heroText} align="center" variant="h4" gutterbottom>
                Dequery uses blockchain to create a decentralized marketplace for curious minds
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>What is Dequery's mission?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery's mission is to build a decentralized question and answer marketplace. Users putting bounties on question encourages increased thoughtfulness about the questions because the users are paying to ask. Additionally, the higher the bounty the more the asker can incentivize high quality answers. This is also not a zero sum game, as the platform grows and proves the value of providing insightful questions and answers the demand and therefore total value for the bounty currency called DEQ grows. Dequery's commitment to running on open state smart-contracts provides transparency and automates bureaucratic costs so that the platform can truly become a public good for going down the rabbit hole of questions with others. Dequery is a place to learn and earn.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>How does Dequery work?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery uses its own token called DEQ to allow users to put bounties on their questions. Once the question expires, DEQ is paid to other users who provided answers. The amount of DEQ each user receives for their answer is based on the weighted number of votes their answer receives. A user can upvote answers to a bounty based on how much bounty the user contributed to the question. Users can increase the bounty of a question at any point before it expires.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Why doesn't Dequery payout directly in USD, BTC or ETH?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery aims to tie the value of DEQ as directly as possible to the value the community provides by creating useful questions and answers. Using another currency for bounties would put a large portion of the bounties value outside of the Dapp's community.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Which blockchain network does Dequery use?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery currently runs on a centralized server during the alpha phase in order to hone the community experience and game theory without gas fees. DEQ plans to launch as an ERC-20 token on the Ethereum network. The beta phase does allow users to request to pay out DEQ for DAI or USD at a 1 to 1 ratio. In app DEQ will convert to on-chain DEQ during the ICO.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>How can I join Dequery?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Sign up <Link to="/signup"> here</Link>.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Where can I find more information about Dequery?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <a href="https://docs.google.com/document/d/1VsMbWJxPcDNJFNSEdHfKyL9v8WREks9d5t0Ot_7maPs/edit">draft whitepaper</a>.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Container>
  );
}

export default About;
