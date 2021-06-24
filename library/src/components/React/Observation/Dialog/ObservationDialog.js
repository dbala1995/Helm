import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

import { Typography, Grid } from "@material-ui/core"



export default function ObservationDialog(props) {
    const { onClose, open, errorPresent } = props

    console.log("in dialog:", errorPresent)

    return (
        < React.Fragment >
            <Dialog
                disableAutoFocus={true}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                open={open}
                fullWidth
                maxWidth="sm"
                style={{ overflow: "hidden" }}
            >
                <div className="modal--primary">
                    <DialogTitle id="dialog-title" className="modal--title" >
                        {errorPresent ? "Error" : "Saved entries"}
                    </DialogTitle>
                </div>
                <Typography id="dialog-description" className="modal--description" >
                    {errorPresent ? "Fix all the errors before saving entries" : ""}
                </Typography>
                <div className="modal--toolbar">
                    <Grid
                        container
                        direction="row"
                        justify="flex-end">
                        <Grid item>
                            <Button aria-label={errorPresent ? "Understood" : "OK"} onClick={() => onClose()} className="modal--button">
                                {errorPresent ? "Understood" : "OK"}
                            </Button>
                        </Grid>
                    </Grid>
                </div>

            </Dialog>
        </React.Fragment >
    )
}
