import { createSlice } from "@reduxjs/toolkit"

const ObservationFormSlice = createSlice({
    name: "observationForm",
    initialState: {
        fieldsArray: [],
        fieldsValue: JSON.parse(sessionStorage.getItem("fieldsValue")) ? JSON.parse(sessionStorage.getItem("fieldsValue")) : [],
        open: false
    },
    reducers: {
        populateFieldsArray: (state, action) => {
            const observations = action.payload
            if (observations.length > 0) {
                const newFieldsArray = []
                observations.map((obj) => {
                    const titleObj = {}
                    const titleArray = []
                    const title = obj.title
                    obj.input.definitions.map((defObj) => {
                        const objToPush = {
                            text: defObj.code.text,
                            unit: defObj.quantitativeDetails.unit.coding[0].unit,
                            display: defObj.display == "false" ? false : true,
                            type: defObj.permittedDataType,
                            decimalPlaces: defObj.quantitativeDetails.decimalPrecision,
                            code: defObj.code,
                            calculated: defObj.calculated,
                        }
                        titleArray.push(objToPush)
                    })
                    titleObj[title] = titleArray
                    newFieldsArray.push(titleObj)
                })
                state.fieldsArray = newFieldsArray
            }
        },
        populateFieldsValue: (state, action) => {
            if (state.fieldsValue.length === 0) {
                const observations = action.payload;
                const newFieldsValue = []
                observations.map((obj) => {
                    const fieldNames = []
                    obj.input.definitions.map((defObj) => {
                        fieldNames.push(defObj.code.text);
                    })
                    const fieldNamesObj = {}
                    fieldNames.map((name) => {
                        fieldNamesObj[name] = {
                            "value": "",
                            "error": false,
                            "errorMessage": ""
                        }
                    })
                    fieldNamesObj["Date"] = {
                        "value": "",
                        "error": false,
                        "errorMessage": ""
                    }
                    fieldNamesObj["Notes"] = {
                        "value": "",
                        "error": false,
                        "errorMessage": ""
                    }
                    newFieldsValue.push(fieldNamesObj)
                })
                state.fieldsValue = newFieldsValue
            }
        },
        onFieldsValueChangeHandler: (state, action) => {
            const tabNo = action.payload.tabNo
            const newValue = action.payload.newValue
            const fieldName = action.payload.fieldName
            state.fieldsValue[tabNo][fieldName].value = newValue;
            sessionStorage.setItem("fieldsValue", JSON.stringify(state.fieldsValue))
        },
        onFieldsErrorChangeHandler: (state, action) => {
            const tabNo = action.payload.tabNo
            const newValue = action.payload.newValue
            const fieldName = action.payload.fieldName
            const errorMessage = action.payload.errorMessage
            state.fieldsValue[tabNo][fieldName].error = newValue
            state.fieldsValue[tabNo][fieldName].errorMessage = errorMessage
        },
        setOpen: (state, action) => {
            state.open = action.payload
        },
    },
})

export const selectFieldsArray = (state) => state.observationForm.fieldsArray
export const selectFieldsValue = (state) => state.observationForm.fieldsValue
export const selectOpen = (state) => state.observationForm.open

export const {
    populateFieldsArray,
    populateFieldsValue,
    onFieldsValueChangeHandler,
    onFieldsErrorChangeHandler,
    setOpen,
} = ObservationFormSlice.actions

export default ObservationFormSlice.reducer
