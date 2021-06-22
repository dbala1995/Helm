import React, { useRef } from "react"
import TableHeader from "../../../core/common/TableHeader"
import Breadcrumbs from "../../../core/common/Breadcrumbs"
import backgroundImage from "../../images/Artboard.png"
import { useEffect, useState } from "react"
import { PageTitle } from "../../../core/common/PageTitle"
import ErrorDialog from "../../common/Dialogs/ErrorDialog"
import get from "lodash/get"
import { withRouter, Prompt } from "react-router-dom"


function AboutMe(props) {
    const canvasRef = useRef(null)

    const [makeApiCall, setMakeApiCall] = useState(false)
    const [apiReturnMsg, setApiReturnMsg] = useState({ message: false, status: 200 })

    const [mounted, setMounted] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log("initial mounted: ", mounted)
        return () => {
            setMounted(false)
            setOpen(true)
            console.log("final mounted: ", mounted)
        }
    }, [])

    const removeErrorNotification = () => {
        setApiReturnMsg({
            message: false,
            status: 200
        })
    }

    const apiCall = async () => {
        const response = await fetch("http://helm-local.com/api/patient/fhir/Questionnaire?identifier=https://fhir.myhelm.org/questionnaire-identifier|aboutMe", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json"
            }
        })
        const result = {}
        if (response.status === 200) {
            result.message = false
        } else {
            result.message = true
        }
        result.status = response.status
        setApiReturnMsg(result)
    }

    useEffect(() => {
        window.analytics.page({ url: window.location.hash })
        const token = localStorage.getItem("token");

        const headers = {
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }

        canvasRef.current.setAuthHandler((request, options) => {
            request.headers = headers
            return request
        })
        setMakeApiCall(!makeApiCall)
    }, [])

    useEffect(() => {
        window.setInterval(apiCall(), 1.2 * 1000000)
    }, [makeApiCall])

    const resourceUrl = "about-me"
    const title = "About Me"

    const breadcrumbsResource = [{ url: "/" + resourceUrl, title: title, isActive: false }]

    return (
        <React.Fragment>
            <PageTitle />
            <Breadcrumbs resource={breadcrumbsResource} />
            <TableHeader resource={resourceUrl} />


            <syn-canvas ref={canvasRef} library-root="http://localhost:8882/registry">
                <div style={{ background: `url${backgroundImage}` }}>
                    <syn-panel
                        panel-id="questionnaire-panel"
                        panel="questionnaire-panel"
                        questionnaire-src="http://helm-local.com/api/patient/fhir/Questionnaire?identifier=https://fhir.myhelm.org/questionnaire-identifier|aboutMe"
                        // top3ThingsQuestionnaire-src="http://helm-local.com/api/patient/fhir/Questionnaire?identifier=https://fhir.myhelm.org/questionnaire-identifier|topThreeThings"
                        submit="http://helm-local.com/api/patient/fhir"
                        questionnaireresponse-root="http://helm-local.com/api/patient/fhir/QuestionnaireResponse?_sort=-authored"
                    ></syn-panel>
                </div>
            </syn-canvas>

            {apiReturnMsg.message ? (
                <ErrorDialog
                    fullScreen={false}
                    width="md"
                    httpErrors={apiReturnMsg}
                    removeErrorNotification={removeErrorNotification}
                />) : null}
            <Prompt message={"Are you sure you wish to leave this page?\n\n" +
                "Your answers haven't been saved. You can submit and save your answers by continuing to the last page of the questionnaire.\n\n" +
                "Would you like to continue to leave this page?"} />
        </React.Fragment >
    )
}

export default withRouter(AboutMe)