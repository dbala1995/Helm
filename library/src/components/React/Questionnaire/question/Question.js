import { FormControl, Grid, Typography, TextField, Button, IconButton, Accordion, AccordionSummary, AccordionDetails, ListItemAvatar } from '@material-ui/core';
import React, { useEffect } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import DoneIcon from '@material-ui/icons/Done';

import PastAnswers from '../pastAnswers/PastAnswers';

import { useStyles } from '../Styles';

import { useSelector, useDispatch } from 'react-redux';
import {
    selectActiveStep,
    handleNext,
    handleBack
} from '../stepper/VerticalLinearStepperSlice';
import {
    selectQuestionResponse,
    selectEdit,
    setEdit,
    selectDate,
    setDate,
    selectDisplayDate,
    setQuestionResponse
} from './QuestionSlice';
import {
    selectQuestions,
    selectQuestionnaireResponse,
    selectQuestionResponseItems,
    updateQuestionResponses,
    obtainAnsweredQuestions
} from '../QuestionnaireSlice';
import {
    selectGroupedPrevAnswers,
    selectPreviousAnswers
} from '../pastAnswers/PastAnswersSlice';

import {
    getDate
} from '../Utils/Utils';


export default function Question(props) {
    const classes = useStyles();
    const activeStep = useSelector(selectActiveStep);
    const questionsObjects = useSelector(selectQuestions);
    const date = useSelector(selectDate);
    const displayDate = useSelector(selectDisplayDate);
    const questionResponseItems = useSelector(selectQuestionResponseItems);
    const prevAnswers = useSelector(selectPreviousAnswers);
    const questionnnaireResponse = useSelector(selectQuestionnaireResponse);
    const groupedPrevAnswers = useSelector(selectGroupedPrevAnswers);
    const edit = useSelector(selectEdit);
    const questionResponse = useSelector(selectQuestionResponse);
    const dispatch = useDispatch();

    const { submit } = props;

    useEffect(() => {
        obtainCurrentResponse(0)
    }, [activeStep])

    useEffect(() => {
        obtainCurrentResponse(0)
    }, [groupedPrevAnswers])

    useEffect(() => {
        dispatch(obtainAnsweredQuestions())
    }, [edit])

    const onUpdateAnswer = () => {
        if (activeStep <= questionsObjects.length - 1) {
            const item = {
                "linkId": questionsObjects[activeStep].linkId,
                "text": questionsObjects[activeStep].prefix,
                "answer": [{ "valueString": questionResponse, "valueDateTime": date === null ? new Date().toString() : date }]
            }
            dispatch(updateQuestionResponses(item))
        }
        dispatch(obtainAnsweredQuestions())
    }

    const onAnswerChangeHandler = (e) => {
        dispatch(setQuestionResponse(e.target.value))
    }

    const onNextClickHandler = async () => {
        edit ? dispatch(setEdit(false)) : null
        await dispatch(handleNext())
        onUpdateAnswer()
    }

    const onBackClickHandler = async () => {
        edit ? dispatch(setEdit(false)) : null
        await dispatch(handleBack())
        onUpdateAnswer()
    }

    const obtainCurrentResponse = (step) => {
        if (questionsObjects.length > 0) {
            const foundQuestionObj = questionResponseItems.find((item) => item.linkId == questionsObjects[activeStep + step].linkId)
            if (foundQuestionObj) {
                dispatch(setQuestionResponse(foundQuestionObj.answer[0].valueString))
                dispatch(setDate(foundQuestionObj.answer[0].valueDateTime))
            }
            else {
                obtainPrevResponse(step)
            }

        }
    }


    const obtainPrevResponse = (step) => {
        if (questionsObjects.length > 0 && groupedPrevAnswers[activeStep]) {
            // const foundPrevObj = prevAnswers[0].answers.find((item) => item.linkId == questionsObjects[activeStep + step].linkId)
            const foundPrevObj = groupedPrevAnswers[activeStep][0]
            if (foundPrevObj) {
                dispatch(setQuestionResponse(foundPrevObj.valueString))
                dispatch(setDate(foundPrevObj.valueDateTime))
            } else {
                dispatch(setQuestionResponse("")) && dispatch(setDate(""))
            }
        } else {
            dispatch(setQuestionResponse("")) && dispatch(setDate(""))
        }

    }

    const activeStepToLinkIdObj = {
        0: "item1",
        1: "item2",
        2: "item3",
        3: "item4"
    }

    const countNoOfPrevAnswers = () => {
        if (groupedPrevAnswers[activeStep]) {
            return groupedPrevAnswers[activeStep].length
        }
        return 0
    }


    return (

        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            spacing={2}>
            <Grid item>
                <Typography variant="h5">
                    {questionsObjects[activeStep].prefix}
                </Typography>
            </Grid>
            <Grid item>
                <FormControl fullWidth >
                    <Typography>
                        <p dangerouslySetInnerHTML={{ __html: questionsObjects[activeStep].text }}>
                        </p>
                    </Typography>
                    <TextField
                        id="outlined-multiline-static"
                        // label="Multiline"
                        multiline
                        rows={4}
                        // defaultValue={getLatestPrevAnswer()}
                        value={questionResponse}
                        variant="outlined"
                        helperText={displayDate}
                        onChange={(e) => onAnswerChangeHandler(e)}
                        disabled={!edit}
                    />

                </FormControl>
            </Grid>

            <Grid item>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="flex-end">
                    <Grid item>
                        {activeStep > 0 ?
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => onBackClickHandler()}
                                className={classes.button}
                                startIcon={<NavigateBeforeIcon />}
                            >
                                Previous
                            </Button>
                            : null}
                    </Grid>
                    <Grid item>
                        {/* Ensuring button does not show after all questions answered */}
                        <div className={classes.buttonRight}>
                            {
                                edit ?
                                    activeStep === questionsObjects.length - 1 ?
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<NavigateNextIcon />}
                                            onClick={() => onNextClickHandler()}>
                                            Finish
                                            </Button> :
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            endIcon={<NavigateNextIcon />}
                                            onClick={() => onNextClickHandler()}>
                                            Next
                                            </Button>
                                    :
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={
                                            () => {
                                                dispatch(setEdit(!edit))
                                                dispatch(setDate(new Date().toString()))
                                            }
                                        }>
                                        edit
                                        </Button>
                            }
                        </div>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content">
                        <Typography>
                            <u><b>Previous answers ({countNoOfPrevAnswers()})</b></u>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PastAnswers requestResources={props.requestResources} noOfPrevAnswers={countNoOfPrevAnswers()} />
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid >
    )
}