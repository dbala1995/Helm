import React from "react"
import { Provider } from "react-redux"
import { store } from "../app/observationStore"
import { withCanvas, withResource, withSubmit, withResourceRoot, withConfiguration } from "synrb-panel-library"
import { ReactMaterialComponentBase } from "./ReactMaterialComponentBase"
import Observation from "../React/Observation/Observation"

class ObservationComponent extends ReactMaterialComponentBase {
    constructor() {
        super()
        this.jsxRootComponent = () => {
            const configuration = this.configuration || null
            const observations = this.resources["Observation"] || []

            return (
                <Provider store={store}>
                    <Observation
                        configuration={configuration}
                        observations={observations}
                        getObservations={(codes) => this.refreshResources(codes)}
                        saveObservations={(observations) => this.saveResources(observations)}
                        sendMessage={(message) => this.message(this.createMessage(message))}
                    />
                </Provider>
            )
        }
    }

    /**
     * @param {fhir.Coding[]} codes
     * @returns {Promise<void>}
     */
    refreshResources(codes) {
        // const codeString = codes.map((code) => (code.system ? `${code.system}|${code.code}` : code)).join(",")

        this.message(this.createMessage("Getting measurements"))

        return this.requestResources("Observation", "", {})
    }

    resourcesChangedCallback(resourceType) {
        if (resourceType !== "Observation") {
            return
        }

        this.message(this.createMessage("Measurements loaded"))
    }

    /**
     * @param {string} message
     * @returns {fhir.OperationOutcome}
     */
    createMessage(message) {
        /** @type {fhir.OperationOutcome} */
        const operationOutcome = {
            resourceType: "OperationOutcome",
            issue: [
                {
                    severity: "information",
                    code: "informational",
                    diagnostics: message,
                },
            ],
        }

        return operationOutcome
    }

    /**
     * @param {fhir.Observation[]} observations
     * @returns {Promise<void>}
     */
    async saveResources(observations) {
        // const changeRequests = observations.map((observation) => ({
        //     changeOperation: "POST",
        //     changedResource: observation,
        // }))
        const changeRequest = {
            changeOperation: "POST",
            changedResource: observations,
        }

        const result = await this.submit([changeRequest])

        return result
    }

    configurationChangedCallback() {
        this.render()
    }
}

customElements.define(
    "helm-observation-component",
    withConfiguration(withResourceRoot(withSubmit(withCanvas(ObservationComponent)), "ObservationResponse"))
)
