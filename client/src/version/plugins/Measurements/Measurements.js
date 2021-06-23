import React, { useRef } from "react"
import TableHeader from "../../../core/common/TableHeader"
import Breadcrumbs from "../../../core/common/Breadcrumbs"
import backgroundImage from "../../images/Artboard.png"
import { useEffect, useState } from "react"
import { PageTitle } from "../../../core/common/PageTitle"
import ErrorDialog from "../../common/Dialogs/ErrorDialog"
import jwt_decode from "jwt-decode";
import moment from "moment";

export default function Measurements(props) {
    const canvasRef = useRef(null)

    const [makeApiCall, setMakeApiCall] = useState(false)
    const [apiReturnMsg, setApiReturnMsg] = useState({ message: false })

    const removeErrorNotification = () => {
        setApiReturnMsg(
            {
                message: false
            }
        )
    }

    const checkTokenValid = async () => {
        const token = localStorage.getItem("token")
        const result = { message: false }
        if (token) {
            const decodedToken = jwt_decode(token)
            const exp = decodedToken.exp
            if (moment(moment.now()).isAfter(moment(exp * 1000))) {
                result.message = true
            } else {
                result.message = false
            }
        }
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
        window.setInterval(() => {
            checkTokenValid()
            console.log("insideInterval")
        }, 1.2 * 1000000)
    }, [makeApiCall])

    const resourceUrl = "measurements"
    const title = "Measurements"

    const breadcrumbsResource = [{ url: "/" + resourceUrl, title: title, isActive: false }]

    return (
        <React.Fragment>
            <PageTitle />
            <Breadcrumbs resource={breadcrumbsResource} />
            <TableHeader resource={resourceUrl} />

            {apiReturnMsg.message ? (
                <ErrorDialog
                    fullScreen={false}
                    width="md"
                    httpErrors={apiReturnMsg}
                    removeErrorNotification={removeErrorNotification}
                />) :
                <syn-canvas ref={canvasRef} library-root="http://localhost:8882/registry">
                    <div style={{ background: `url${backgroundImage}` }}>
                        <syn-panel
                            panel-id="observation-panel"
                            panel="observation-panel"
                            submit="http://helm-local.com/api/patient/fhir"
                            observation-root="http://helm-local.com/api/patient/fhir/Observation"
                            configuration="http://helm-local.com/ObservationDefinitions.json"
                        ></syn-panel>
                    </div>
                </syn-canvas>}

        </React.Fragment >
    )
}
