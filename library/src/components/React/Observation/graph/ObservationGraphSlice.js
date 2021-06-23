import { createSlice } from "@reduxjs/toolkit"

const ObservationGraphSlice = createSlice({
    name: "observationGraph",
    initialState: {
        labels: [],
        datasets: [],
        colourArray: ["rgba(75,192,192,1)", "#742774", "#808080", "#808000"],
    },
    reducers: {
        populateLabels: (state, action) => {
            state.labels = action.payload["Date"]
        },
        populateDatasets: (state, action) => {
            if (action.payload) {
                const keyArray = Object.keys(action.payload)
                const newDatasetArray = []
                keyArray.map((label, index) => {
                    if (label !== "Date") {
                        const dataset = {}
                        dataset.label = label
                        dataset.data = action.payload[label]
                        dataset.borderColor = state.colourArray[index]
                        dataset.spanGaps = true
                        dataset.tension = 0.4
                        newDatasetArray.push(dataset)
                    }
                })
                state.datasets = newDatasetArray
            }
        }
    }
})

export const selectLabels = (state) => state.observationGraph.labels
export const selectDatasets = (state) => state.observationGraph.datasets

export const { populateLabels, populateDatasets } = ObservationGraphSlice.actions

export default ObservationGraphSlice.reducer
