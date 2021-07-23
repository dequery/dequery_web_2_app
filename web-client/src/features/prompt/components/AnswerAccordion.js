import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { EditorState, convertToRaw } from 'draft-js';
import { useSelector, useDispatch } from 'react-redux';

import { createAnswer } from 'features/prompt/promptSlice';
import { selectUser } from 'features/auth/authSlice';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AnswerEditor from 'features/prompt/components/AnswerEditor';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  centeredGrid: {
    textAlign: 'center',
  }
}));

function AnswerAccordion(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { prompt } = props;
  const disabled = Boolean(!user.pk || (prompt.status !== 'active'));

  const onSubmitCreate = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    dispatch(createAnswer({ content, prompt: prompt.pk }));
  }

  return (
      <Accordion disabled={disabled} style={{flex: true, flexGrow: 1}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Create Answer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            alignItems="center"
            container
            direction="row"
            justify="center"
            spacing={3}
          >
            <Grid item xs={12}>
              <AnswerEditor onEditorStateChange={setEditorState} editorState={editorState} />
            </Grid>
            <Grid item className={classes.centeredGrid} xs={12}>
              <Button
                color="primary"
                onClick={onSubmitCreate}
                variant="contained"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
  );
}

export default AnswerAccordion;
