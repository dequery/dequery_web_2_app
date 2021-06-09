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
    marginTop: '-40px',
    paddingBottom: '40px',
    marginBottom: '-20px',
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
              image={`${process.env.PUBLIC_URL}/unsplashed_hole.jpeg`}
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
              <Typography className={classes.heading}>How does Dequery work?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery uses its own token called DEQ to allow users to put bounties on their questions. Once the question expires, DEQ is paid to other users who provided answers. The amount of DEQ each user receives for their answer is based on the weighted number of votes their answer receives.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Why doesn't Dequery payout in USD, BTC or ETH?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Dequery aims to tie the value of DEQ as directly as possible to the value the community provides by creating useful questions and answers. Using another currency for bounties would put a large portion of the bounties value outside of the Dapp's control.
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
                Dequery currently runs on a centralized server during the alpha phase in order to hone the user experience and game theory without gas fees. DEQ plans to launch as an ERC-20 token on the Ethereum network. The alpha phase does allow users to request to pay out DEQ for ETH at a 10,000 DEQ to 0.1 ETH ratio. On-chain DEQ will also get paid out to all participating alpha users.              </Typography>
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
                Use <Link to="/alpharequest">this form</Link> to request alpha access.
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
