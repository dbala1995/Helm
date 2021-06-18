import { createSlice } from '@reduxjs/toolkit';

const VerticalLinearStepperSlice = createSlice({
    name: "verticalLinearStepper",
    initialState: {
        activeStep: 0,
        adjustedActiveStep: -1
    },
    reducers: {
        handleNext: (state) => {
            state.activeStep = state.activeStep + 1;
            sessionStorage.setItem("activeStep", state.activeStep)
        },
        handleBack: (state) => {
            state.activeStep > 0 ? state.activeStep = state.activeStep - 1 :
                sessionStorage.setItem("activeStep", state.activeStep)
        },
        handleReset: (state) => {
            state.activeStep === 0 ? null : state.activeStep = 0
            sessionStorage.setItem("activeStep", state.activeStep)
        },
        changeToQuestion: (state, action) => {
            const questionNo = Number(action.payload)
            state.activeStep = questionNo
            sessionStorage.setItem("activeStep", state.activeStep)
        }
    }
})

export const selectActiveStep = (state) => state.verticalLinearStepper.activeStep;
export const selectAdjustedActiveStep = (state) => state.verticalLinearStepper.adjustedActiveStep;

export const { handleNext, handleBack, handleReset, changeToQuestion } = VerticalLinearStepperSlice.actions;

export default VerticalLinearStepperSlice.reducer;