import { CircularProgress, Grid, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ObservationTabs from './tabs/ObservationTabs';
import Content from './content/Content';

import { useSelector, useDispatch } from 'react-redux';
import {
    selectObservations,
    setObservations,
    setPrevResponses,
    updatePrevResponses
} from './ObservationSlice';


export default function Observation(props) {
    const {
        configuration,
        observations,
        saveObservations,
        getObservations
    } = props

    const observationsState = useSelector(selectObservations);

    const dispatch = useDispatch()

    const [show, setShow] = useState(false)



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

    useEffect(() => {
        setTimeout(() => { setShow(true) }, 2 * 1000)
    }, [show])

    return (
        !show ?
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
            : observationsState.length == 0 ? null :
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={3}>
                    <Grid item >
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="stretch"
                            spacing={3}>
                            <Grid item xs={12}>
                                <ObservationTabs configuration={configuration} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="stretch"
                            spacing={3}>
                            <Grid item xs={12}>
                                <Content saveObservations={saveObservations} getObservations={getObservations} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
    )
}