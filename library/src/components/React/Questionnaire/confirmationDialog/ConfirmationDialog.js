import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Slide from "@material-ui/core/Slide"

import { useDispatch, useSelector } from 'react-redux';
import {
    selectOpen,
    setOpen
} from './ConfirmationDialogSlice';
import {
    selectQuestions,
    selectQuestionnaireResponse,
    obtainAnsweredQuestions,
} from '../QuestionnaireSlice';
import { Grid, Typography } from "@material-ui/core"



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function AlertDialogSlide(props) {
    const open = useSelector(selectOpen);
    const questionnaireResponse = useSelector(selectQuestionnaireResponse);
    const dispatch = useDispatch();

    const onCloseHandler = () => {
        // dispatch(handleReset())
        dispatch(setOpen(false))
    }

    const onSubmitHandler = async () => {
        dispatch(obtainAnsweredQuestions())
        const changedResources = {
            changedResource: questionnaireResponse,
            changeOperation: "POST",
        }
        await props.submit(changedResources)
        dispatch(setOpen(false))
        sessionStorage.removeItem("questionResponseItems")
    }

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                maxWidth="md"
                onBackdropClick={() => onCloseHandler()}
                onClose={() => onCloseHandler()}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                style={{ overflow: "hidden" }}
            >
                <div className="modal--primary">
                    <DialogTitle id="alert-dialog-slide-title" className="modal--title">
                        Don't forget
                    </DialogTitle>
                </div>
                <Typography id="alert-dialog-slide-description" className="modal--description">
                    If you need urgent medical attention please contact your GP surgery, ring 111 or 999.

                    You remain responsible for acting on the health concerns you may have. The information you enter here will be shared with health and care practitioners involved in your care.
                </Typography>
                <div className="modal--toolbar">
                    <Grid container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        >
                        <Grid item>
                            <Button
                                aria-label="Cancel"
                                onClick={() => onCloseHandler()} >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className="modal--button"
                                aria-label="Accept &amp; Continue"
                                onClick={() => onSubmitHandler()} >
                                Accept &amp; Continue
                            </Button>
                        </Grid>
                    </Grid>
                </div>

            </Dialog>
        </div >
    )
}
