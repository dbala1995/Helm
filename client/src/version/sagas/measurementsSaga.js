import React from "react"
import { takeEvery, put } from "redux-saga/effects"
import { Link } from "react-router-dom"
import Typography from "@material-ui/core/Typography"

import { SYNOPSIS_MEASUREMENTS_ACTION, synopsisMeasurementsAction } from "../actions/synopsisActions"

export const getMeasurementsSaga = takeEvery(SYNOPSIS_MEASUREMENTS_ACTION.REQUEST, function* (action) {
    yield put(
        synopsisMeasurementsAction.success({
            heading: "measurements",
            synopsis: [
                {
                    text: (
                        <React.Fragment>
                            <Typography>
                                Record your personal health data such as blood pressure at home.
                            </Typography>
                        </React.Fragment>),
                },
            ],
        })
    )
})
