import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import HiddenPromptList from 'features/prompt/components/HiddenPromptList';
import PromptList from 'features/prompt/components/PromptList';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      style={{flexGrow: 1}}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  container: {
    flexGrow: 1,
    marginTop: '-40px',
    width: '100%',
  },
  tab: {
    width: '33.3%',
  },
  tabs: {
    width: '100%',
  },
}));


export function PromptTabs() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
      alignItems="center"
      container
      className={classes.container}
      direction="row"
      justify="center"
    >
      <Tabs className={classes.tabs} variant="fullWidth" value={value} onChange={handleChange}>
        <Tab className={classes.tab} label="Public"/>
        <Tab className={classes.tab} label="Hidden"/>
        <Tab className={classes.tab} label="Direct"/>
      </Tabs>
      <TabPanel value={value} index={0}>
        <PromptList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HiddenPromptList />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Container>
          Create a prompt that only a specified user can answer (coming soon)
        </Container>
      </TabPanel>
    </Grid>
  );
}

export default PromptTabs;
