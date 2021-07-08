import { Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useDispatch } from 'react-redux';
import { handleNext } from '../stepper/VerticalLinearStepperSlice';
import { setEdit } from '../question/QuestionSlice';


export default function Summary() {
    const dispatch = useDispatch()
    return (
        <div>
            <Typography variant="h4">
                <b>What Matters to me?</b>
            </Typography>
            <Typography vartiant="h6">
                <b>What is Leeds trying to do?</b>
            </Typography>
            <Typography>
                <p>In Leeds, we aim to support you to live a good life and maintain or improve your independence.
                    Knowing what matters to you supports more meaningful conversations between you and the people who provide health and care.
                    It will build on what is already going well and help you to have more choice and control over the way you receive care and support. <br></br></p>
            </Typography>
            <Typography>
                <p>The following 4 questions have been designed to help you reflect on what matters to you and what you would like to share with someone supporting you.
                    This may be something specific such as goals and hopes or it could be something more general.<br></br></p>
            </Typography>
            <Typography>
                What matters to you will also be shared others who support you to ensure that everyone works together to help you achieve this.
            </Typography>

            <Grid
                container
                direction="row"
                justify="flex-end"
            >
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<NavigateNextIcon />}
                        onClick={() => {
                            dispatch(setEdit(true))
                            dispatch(handleNext())
                        }}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </div >
    )
}