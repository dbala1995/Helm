import React from "react"
import { takeEvery, put } from "redux-saga/effects"
import Typography from "@material-ui/core/Typography"

import { SYNOPSIS_ABOUT_ME_ACTION, synopsisAboutMeAction } from "../actions/synopsisActions"

const getLastResponse = async () => {
    const response = await fetch(
        "http://helm-local.com/api/patient/fhir/QuestionnaireResponse?_sort=-authored&_count=1&questionnaire.identifier=https://fhir.myhelm.org/questionnaire-identifier|aboutMe",
        {
            method: "GET",
            headers: {
                "Authorization": `bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })

    var result = { id: "NONE" }
    if (response.status === 200) {
        result = await response.json()
        if (result.entry.length > 0)
            return obtainLatestResponses(result)
        else
            return null

    } else {
        return null
    }
}

const obtainLatestResponses = (result) => {
    const arrayOfResponses = result.entry[0].resource.item
    const questionAnswerList = []
    arrayOfResponses.map((obj, index) => {
        questionAnswerList.push({
            question: obj.text,
            answer: obj.answer[0].valueString,
            date: obj.answer[0].valueDateTime
        }
        )
    })
    console.log(questionAnswerList)
    return questionAnswerList
}


export const getAboutMeSaga = takeEvery(SYNOPSIS_ABOUT_ME_ACTION.REQUEST, function* (action) {
    const response = yield getLastResponse();


    yield put(
        synopsisAboutMeAction.success({
            heading: "what-matters-to-me",
            synopsis: response ? [
                {
                    text: (
                        <React.Fragment>
                            <Typography>
                                4 questions designed to help you reflect on what matters to you.
                            </Typography>
                        </React.Fragment>),
                },
                {
                    text: (
                        <React.Fragment >
                            <Typography>
                                Information last submitted ({response[0].date})
                            </Typography>
                        </React.Fragment >
                    )
                },
                {
                    text: (
                        <React.Fragment>
                            {response.map((obj) => (
                                <div>
                                    <Typography>
                                        {String(obj.question)}
                                    </Typography>
                                    <Typography>
                                        {"Answer: " + String(obj.answer)}
                                    </Typography>
                                </div >
                            ))
                            }
                        </React.Fragment >
                    )
                }
            ] : [
                {
                    text: (
                        <React.Fragment>
                            <Typography>
                                4 questions designed to help you reflect on what matters to you.
                            </Typography>
                        </React.Fragment>),
                },
                {
                    text: (
                        <React.Fragment >
                            <Typography>
                                No previous entries.
                            </Typography>
                        </React.Fragment >
                    )
                },
            ],
        })
    )
})
