import { CircularProgress, Grid, Paper } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import ObservationTabs from "./tabs/ObservationTabs"
import Content from "./content/Content"

import { useSelector, useDispatch } from "react-redux"
import { selectObservations, setObservations, setPrevResponses, updatePrevResponses } from "./ObservationSlice"

export default function Observation(props) {
    const { configuration, observations, saveObservations, getObservations, sendMessage } = props

    const observationsState = useSelector(selectObservations)

    const dispatch = useDispatch()

    const [show, setShow] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setShow(true)
        }, 2.0 * 1000)
    }, [show])

    useEffect(() => {
        if (configuration) {
            dispatch(setObservations(configuration.observations))
            dispatch(setPrevResponses(configuration.observations))
            getObservations([""])
        }
    }, [configuration])

    useEffect(() => {
        dispatch(updatePrevResponses(observations))
    }, [observations])

    return !show ? (
        <Paper elevation={0}>
            <Grid container spacing={0}>
                <Grid item xs={12} style={{ position: "relative", height: 300 }}>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            background: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#3596f4",
                        }}
                    >
                        <CircularProgress size={70} color="inherit" />
                    </div>
                </Grid>
            </Grid>
        </Paper>
    ) : (
        observationsState.length !== 0 && (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
                spacing={3}
                style={{ margin: 0, width: "100%" }}
            >
                <Grid item xs={12} style={{ padding: 0 }}>
                    <ObservationTabs configuration={configuration} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Content
                                sendMessage={sendMessage}
                                saveObservations={saveObservations}
                                getObservations={getObservations}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    )
}
