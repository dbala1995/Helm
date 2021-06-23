import React, { useRef } from "react"
import TableHeader from "../../../core/common/TableHeader"
import Breadcrumbs from "../../../core/common/Breadcrumbs"
import backgroundImage from "../../images/Artboard.png"
import { useEffect } from "react"
import { PageTitle } from "../../../core/common/PageTitle"
import { setAccessibilityMessage } from "../../../core/actions/accessibilityActions"
import { connect } from "react-redux"

function Measurements(props) {
  const canvasRef = useRef(null)
  const { setAccessibilityMessage } = props

  useEffect(() => {
    window.analytics.page({ url: window.location.hash })
    const token = localStorage.getItem("token")

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
    }

    canvasRef.current.setAuthHandler((request) => {
      request.headers = headers
      return request
    })

    canvasRef.current.setMessageHandler((_, message) => {
      const outcome = /** @type {fhir.OperationOutcome} */ (message)

      const diagnostics = outcome.issue[0].diagnostics

      console.log("*******************************************")
      console.log(diagnostics)

      setAccessibilityMessage(diagnostics)
    })
  }, [canvasRef.current])

  const resourceUrl = "measurements"
  const title = "Measurements"

  const breadcrumbsResource = [{ url: "/" + resourceUrl, title: title, isActive: false }]

  return (
    <React.Fragment>
      <PageTitle />
      <Breadcrumbs resource={breadcrumbsResource} />
      <TableHeader resource={resourceUrl} />

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
