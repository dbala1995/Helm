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
    handleBack,
    selectAdjustedActiveStep
} from '../stepper/VerticalLinearStepperSlice';
import {
    selectQuestionResponse,
    selectEdit,
    setEdit,
    selectDate,
    setDate,
    selectDisplayDate,
    setQuestionResponse,
} from "./QuestionSlice"
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
import { ShadowFocus } from "../../Shadow/ShadowFocus"

export default function Question(props) {
    const classes = useStyles()
    const activeStep = useSelector(selectActiveStep)
    const questionsObjects = useSelector(selectQuestions)
    const date = useSelector(selectDate)
    const displayDate = useSelector(selectDisplayDate)
    const questionResponseItems = useSelector(selectQuestionResponseItems)
    const prevAnswers = useSelector(selectPreviousAnswers)
    const questionnnaireResponse = useSelector(selectQuestionnaireResponse)
    const groupedPrevAnswers = useSelector(selectGroupedPrevAnswers)
    const edit = useSelector(selectEdit)
    const questionResponse = useSelector(selectQuestionResponse)
    const dispatch = useDispatch()

    const { submit } = props

    const adjustActiveStep = useSelector(selectAdjustedActiveStep)

    useEffect(() => {
        sessionStorage.setItem("activeStep", activeStep)
        if (activeStep !== 0)
            obtainCurrentResponse(adjustActiveStep)
    }, [activeStep])

    useEffect(() => {
        if (activeStep !== 0)
            obtainCurrentResponse(adjustActiveStep)
    }, [groupedPrevAnswers])

    useEffect(() => {
        if (activeStep !== 0)
            dispatch(obtainAnsweredQuestions())
    }, [edit])

    const onUpdateAnswer = (step) => {
        if (activeStep <= questionsObjects.length) {
            const item = {
                "linkId": questionsObjects[activeStep + step].linkId,
                "text": questionsObjects[activeStep + step].prefix,
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
        onUpdateAnswer(adjustActiveStep)
    }

    const onBackClickHandler = async () => {
        edit ? dispatch(setEdit(false)) : null
        await dispatch(handleBack())
        onUpdateAnswer(adjustActiveStep)
    }

    const obtainCurrentResponse = (step) => {
        if (questionsObjects.length > 0) {
            const foundQuestionObj = questionResponseItems.find(
                (item) => item.linkId == questionsObjects[activeStep + step].linkId
            )
            if (foundQuestionObj) {
                dispatch(setQuestionResponse(foundQuestionObj.answer[0].valueString))
                dispatch(setDate(foundQuestionObj.answer[0].valueDateTime))
            } else {
                obtainPrevResponse(step)
            }
        }
    }


    const obtainPrevResponse = (step) => {
        if (questionsObjects.length > 0 && groupedPrevAnswers[activeStep + step]) {
            const foundPrevObj = groupedPrevAnswers[activeStep + step][0]
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
        3: "item4",
    }

    const countNoOfPrevAnswers = (step) => {
        if (groupedPrevAnswers[activeStep + step]) {
            return groupedPrevAnswers[activeStep + step].length
        }
        return 0
    }

    return (
        activeStep !== 0 ?
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
                spacing={2}>
                <Grid item>
                    <Typography variant="h5">
                        {questionsObjects[activeStep + adjustActiveStep].prefix}
                    </Typography>
                </Grid>
                <Grid item>
                    <FormControl fullWidth >
                        <Typography>
                            <p dangerouslySetInnerHTML={{ __html: questionsObjects[activeStep + adjustActiveStep].text }}>
                            </p>
                        </Typography>
                        <ShadowFocus>
                            {({ inputRef, focus }) => (
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={4}
                                    value={questionResponse}
                                    helperText={displayDate}
                                    onChange={(e) => onAnswerChangeHandler(e)}
                                    disabled={!edit}
                                    className={focus ? "input--focused" : ""}
                                    InputProps={{
                                        inputRef
                                    }}
                                />
                            )}
                        </ShadowFocus>
                    </FormControl>
                </Grid>

                <Grid item>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-end">
                        <Grid item>
                            {activeStep + adjustActiveStep > 0 ?
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
                                        activeStep === questionsObjects.length ?
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
                                <u><b>Previous answers ({countNoOfPrevAnswers(adjustActiveStep)})</b></u>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <PastAnswers requestResources={props.requestResources} noOfPrevAnswers={countNoOfPrevAnswers(adjustActiveStep)} />
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid > :
            <Summary />
    )
}
