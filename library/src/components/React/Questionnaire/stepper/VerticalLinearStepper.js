import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { FormControl, Grid, MobileStepper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { useSelector, useDispatch } from 'react-redux';

import {
  selectActiveStep,
  handleReset,
  changeToQuestion,
  selectAdjustedActiveStep
} from './VerticalLinearStepperSlice';
import {
  selectQuestions,
  selectQuestionnaireResponse,
  obtainAnsweredQuestions,
} from '../QuestionnaireSlice';


import { setOpen } from "../confirmationDialog/ConfirmationDialogSlice"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  question: {
    cursor: "pointer",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "center"
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}))

export default function VerticalLinearStepper(props) {

  const classes = useStyles();
  const activeStep = useSelector(selectActiveStep);
  const questionnaireResponse = useSelector(selectQuestionnaireResponse);
  const dispatch = useDispatch()
  const additionalSteps = useSelector(selectQuestions)
  const adjustedActiveStep = useSelector(selectAdjustedActiveStep)

  const steps = [{ prefix: "Summary" }]

  additionalSteps.map((step) => {
    steps.push(step)
  })


  const onSubmitHandler = async () => {
    dispatch(setOpen(true))
  }

  return (
    < div >
      <div className={classes.root}>
        <div className={classes.sectionDesktop}>
          <FormControl>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label.prefix}>
                  <StepLabel
                    className={classes.question}
                    onClick={() => {
                      activeStep > index ?
                        dispatch(changeToQuestion(index))
                        : null
                    }}>
                    <Typography gutterBottom={true}><u><b>{label.prefix}</b></u></Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {
              activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                  {/* <Typography>All steps completed - you&apos;re finished</Typography> */}
                  <Button onClick={() => {
                    dispatch(handleReset())
                  }} className={classes.button}>
                    Reset
                  </Button>
                  <Button onClick={() => onSubmitHandler()} color="primary" variant="contained" className={classes.button}>
                    Submit
                  </Button>
                </Paper>
              )
            }
          </FormControl>
        </div>
      </div>
      <div className={classes.sectionMobile}>
        {activeStep == steps.length ?
          <FormControl fullWidth margin="dense">
            < Grid
              container
              direction="row"
              justify="space-between"
              align-items="flex-start"
              spacing={10} >
              <Grid item xs={6}>
                <Button size="small" onClick={() => {
                  // obtainPrevResponse(0)
                  dispatch(handleReset())
                }
                } >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button size="small" onClick={() => onSubmitHandler()} color="primary" variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormControl>
          :
          <MobileStepper
            steps={steps.length}
            position="static"
            variant="text"
            activeStep={activeStep}
          />
        }
      </div>
    </div>
  )
}
