import React, { useRef } from "react"
import TableHeader from "../../../core/common/TableHeader"
import Breadcrumbs from "../../../core/common/Breadcrumbs"
import backgroundImage from "../../images/Artboard.png"
import { useEffect, useState } from "react"
import { PageTitle } from "../../../core/common/PageTitle"
import ErrorDialog from "../../common/Dialogs/ErrorDialog"
import { setAccessibilityMessage } from "../../../core/actions/accessibilityActions"
import { connect } from "react-redux"

function Measurements(props) {
  const { setAccessibilityMessage } = props

  const canvasRef = useRef(null)

  const [makeApiCall, setMakeApiCall] = useState(false)
  const [apiReturnMsg, setApiReturnMsg] = useState({ message: false, status: 200 })

  const removeErrorNotification = () => {
    setApiReturnMsg({
      message: false,
      status: 200,
    })
  }

  const apiCall = async () => {
    const response = await fetch("http://helm-local.com/api/patient/fhir/Observation", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
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
    const token = localStorage.getItem("token")

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
    }

    if (!canvasRef.current) {
      return
    }

    canvasRef.current.setAuthHandler((request) => {
      request.headers = headers
      return request
    })

    canvasRef.current.setMessageHandler((_, message) => {
      const outcome = /** @type {fhir.OperationOutcome} */ (message)

      const diagnostics = outcome.issue[0].diagnostics

      setAccessibilityMessage(diagnostics)
    })
    setMakeApiCall(!makeApiCall)
  }, [canvasRef.current])

  useEffect(() => {
    window.setInterval(() => {
      apiCall()
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
        />
      ) : (
        <syn-canvas ref={canvasRef} library-root="/registry">
          <div style={{ background: `url${backgroundImage}` }}>
            <syn-panel
              panel-id="observation-panel"
              panel="observation-panel"
              submit="/api/patient/fhir"
              observation-root="/api/patient/fhir/Observation"
              configuration="/ObservationDefinitions.json"
            ></syn-panel>
          </div>
        </syn-canvas>
      )}
    </React.Fragment>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAccessibilityMessage: (message) => dispatch(setAccessibilityMessage(message)),
  }
}

const ConnectedMeasurements = connect(null, mapDispatchToProps)(Measurements)

export default ConnectedMeasurements
