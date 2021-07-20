import React, { Component } from "react"
import get from "lodash/get"

import { withStyles } from "@material-ui/core/styles"
import Dialog from "@material-ui/core/Dialog"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

import CustomLogoutButton from "../../../core/common/Buttons/CustomLogoutButton"
import { withMobileDialog } from "@material-ui/core"
import { httpErrorAction } from "../../../core/actions/httpErrorAction"
import { connect } from "react-redux"

const styles = (theme) => ({
  dialogBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      paddingTop: 0,
      paddingLeft: 20,
      paddingRight: 20,
    },
    [theme.breakpoints.up("sm")]: {
      minHeight: 300,
      minWidth: 500,
      marginBottom: 10,
    },
  },
  titleBlock: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: 48,
    paddingLeft: 20,
    backgroundColor: theme.palette.mainColor,
    color: "#fff",
    fontSize: 18,
    fontWeight: 800,
  },
  description: {
    padding: 20,
    fontSize: 15,
    textAlign: "center",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 15,
  },
  reloadButton: {
    padding: 6,
    display: "block",
    width: 140,
    height: 40,
    margin: "8px !important",
    color: "white",
    backgroundColor: theme.palette.dangerColor,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 800,
    "&:hover": {
      color: theme.palette.dangerColor,
      backgroundColor: "white",
    },
  },
})

class ErrorDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isErrorModalOpen: false,
    }
  }

  isJwtMessage(status) {
    return Number(status) === 401 || Number(status) === 403
  }

  isSessionExpired(status) {
    return this.isJwtMessage(status)
  }

  getErrorDescription(status, isJwtOld) {
    let result = "Something is wrong"
    if (Number(status) === 404) {
      result = "API is currently unavailable"
    } else if (Number(status) > 499) {
      result = "Something is wrong with the server. Please try again later."
    } else if (isJwtOld) {
      result = "Your session has expired. Click the button to log in again."
    }
    return result
  }

  closeModal() {
    this.setState({ isErrorModalOpen: false }, () => {
      this.props.removeErrorNotification()
      this.props.removeErrorAlreadyExistingNotification()
    })
  }

  render() {
    const { classes, httpErrors, ...rest } = this.props
    const { isErrorModalOpen } = this.state

    const errorStatus = get(httpErrors, "status", null)
    const errorMessage = get(httpErrors, "message", null)

    const isOpen = isErrorModalOpen || (errorStatus && errorMessage)

    const isJwtOld = this.isSessionExpired(errorStatus)
    const errorDescription = this.getErrorDescription(errorStatus, isJwtOld)
    return (
      <React.Fragment>
        <Dialog
          disableAutoFocus={true}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          open={isOpen}
          {...rest}
        >
          <div className={classes.dialogBlock}>
            <Typography id="dialog-title" className={classes.titleBlock}>
              Connection Error
            </Typography>
            <Typography id="dialog-description" className={classes.description}>
              {errorDescription}
            </Typography>
            <div className={classes.toolbar}>
              <Button aria-label="Close" onClick={() => this.closeModal()}>
                Close
              </Button>
              {isJwtOld ? (
                <CustomLogoutButton title="Login again" hideIcon={true} />
              ) : (
                <Button
                  aria-label="Reload page"
                  className={classes.reloadButton}
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </Button>
              )}
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeErrorAlreadyExistingNotification() {
    dispatch(httpErrorAction.remove())
  },
})

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(withMobileDialog({ breakpoint: "xs" })(ErrorDialog)))
