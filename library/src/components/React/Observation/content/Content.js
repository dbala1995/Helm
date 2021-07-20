import { Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import React, { useEffect } from "react"
import ObservationForm from "../form/ObservationForm"
import ObeservationGraph from "../graph/ObservationGraph"
import Table from "../table/Table"

import { useSelector, useDispatch } from "react-redux"
import { populateInformation, selectInformation } from "./ContentSlice"
import { selectValue } from "../tabs/ObservationTabsSlice"
import { selectObservations } from "../ObservationSlice"

export const useStyles = makeStyles((theme) => ({
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex",
        },
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none",
        },
    },
}))

export default function content(props) {
    const informationArray = useSelector(selectInformation)
    const value = useSelector(selectValue)
    const observations = useSelector(selectObservations)
    const dispatch = useDispatch()
    const classes = useStyles()

    const { saveObservations, getObservations, sendMessage } = props

    useEffect(() => {
        dispatch(populateInformation(observations))
    }, [observations])

    return (
        <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={3}>
            <div className={classes.sectionDesktop}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="space-evenly" alignItems="stretch" spacing={3}>
                        <Grid item xs={5}>
                            <ObservationForm
                                sendMessage={sendMessage}
                                saveObservations={saveObservations}
                                getObservations={getObservations}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h4">
                                {informationArray.length > 0 ? informationArray[value].header : null}
                            </Typography>
                            <Typography variant="subtitle1">
                                {informationArray.length > 0 ? (
                                    <p dangerouslySetInnerHTML={{ __html: informationArray[value].body.join("") }}></p>
                                ) : null}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.sectionMobile}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="space-evenly" alignItems="stretch" spacing={3}>
                        <Grid item xs={10}>
                            <Grid container direction="column" justify="space-evenly" alignItems="stretch" spacing={3}>
                                <Grid item>
                                    <Typography variant="h4">
                                        {informationArray.length > 0 ? informationArray[value].header : null}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {informationArray.length > 0 ? (
                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: informationArray[value].body.join(""),
                                                }}
                                            ></p>
                                        ) : null}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <ObservationForm
                                        saveObservations={saveObservations}
                                        getObservations={getObservations}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Divider />
            <div className={classes.sectionDesktop}>
                <Grid item xs={10}>
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="stretch"
                        spacing={3}>
                        <Grid item xs={5}>
                            <Table />
                        </Grid>
                        <Grid item xs={5}>
                            <ObeservationGraph />
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.sectionMobile}>
                <Grid item xs={12}>
                    <Grid container direction="row" justify="space-evenly" alignItems="stretch" spacing={3}>
                        <Grid item xs={10}>
                            <Grid
                                container
                                direction="column"
                                justify="space-evenly"
                                alignItems="stretch"
                                spacing={3}>
                                <Grid item  >
                                    <Table />
                                </Grid>
                                <Grid item>
                                    <ObeservationGraph />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Grid item>
                <Grid container direction="row" justify="space-evenly" alignItems="stretch" spacing={3}>
                    <Grid item xs={10}>
                        {informationArray.length > 0 ? (
                            <div>
                                <Typography>{informationArray[value].footer.header}</Typography>
                                <Typography>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: informationArray[value].footer.body.join(""),
                                        }}
                                    ></p>
                                </Typography>
                            </div>
                        ) : null}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
