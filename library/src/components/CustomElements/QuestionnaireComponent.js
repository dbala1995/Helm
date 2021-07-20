import React from "react"
import { Provider } from "react-redux"
import { store } from "../app/questionnaireStore"
import { withCanvas, withResource, withSubmit, withResourceRoot } from "synrb-panel-library"
import { ReactMaterialComponentBase } from "./ReactMaterialComponentBase"
import Questionnaire from "../React/Questionnaire/Questionnaire"
import { ThemeProvider } from "@material-ui/styles"

class QuestionnaireComponent extends ReactMaterialComponentBase {
    constructor() {
        super()

        this.jsxRootComponent = () => {
            const questionnaireList = this.resources.Questionnaire
            const top3ThingsQuestionnaire = this.resources.top3ThingsQuestionnaire
<<<<<<< HEAD
            return <Provider store={store} >
                <Questionnaire
                    resources={this.resources}
                    submit={(changedResource) => this.submit([changedResource])}
                    requestResources={(questionResponse, queryParams, bodyParams) => this.requestResources(questionResponse, queryParams, bodyParams)} />
            </Provider >
=======
            return (
                <Provider store={store}>
                    <Questionnaire
                        resources={this.resources}
                        submit={(changedResource) => this.submit([changedResource])}
                        requestResources={(questionResponse, queryParams, bodyParams) =>
                            this.requestResources(questionResponse, queryParams, bodyParams)
                        }
                    />
                </Provider>
            )
>>>>>>> 168031cc1d8b5cc774dc6baf88e8317ce7f18869
        }
    }

    getTop3Things() {}
}

customElements.define(
    "helm-questionnaire-component",
    withResourceRoot(
        withSubmit(
            withResource(withResource(withCanvas(QuestionnaireComponent), "Questionnaire"), "top3ThingsQuestionnaire")
        ),
        "QuestionnaireResponse"
    )
)
