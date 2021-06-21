import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { useDispatch, useSelector } from 'react-redux';
import {
    selectOpen,
    setOpen
} from './ConfirmationDialogSlice';
import { handleReset } from '../stepper/VerticalLinearStepperSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
    const open = useSelector(selectOpen);
    const dispatch = useDispatch();

    const onCloseHandler = () => {
        // dispatch(handleReset())
        dispatch(setOpen(false))
    }

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="md"
                onBackdropClick={() => onCloseHandler()}
                onClose={() => onCloseHandler()}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"

            >
                <DialogTitle id="alert-dialog-slide-title">{"Don't forget"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        If you need urgent medical attention please contact your GP surgery, ring 111 or 999.

                        You remain responsible for acting on the health concerns you may have. The information you enter here will be shared with health and care practitioners involved in your care.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => onCloseHandler()} >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => onCloseHandler()} >
                        Accept &amp; Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
