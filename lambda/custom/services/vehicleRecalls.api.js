'use strict'

const VRDB_API_KEY = process.env.VRDB_API_CANADA_USER_KEY

const fetch = require('node-fetch')

const Recall = require('../models/recall').Recall
const RecallSummary = require('../models/recall').RecallSummary
const ApiPerformanceLog = require('../models/apiPerformanceLog')

// https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/recall-summary/recall-number/2018001
const HOST = 'https://vrdb-tc-apicast-production.api.canada.ca/eng/vehicle-recall-database/v1/'
// const PATH = '/v1.3/api/eng/vehicle-recall-database/'
const RECALL = 'recall'
const MAKE_NAME = '/make-name/'
const MODEL_NAME = '/model-name/'
const YEAR_RANGE = '/year-range/'
const RECALL_SUMMARY = '/recall-summary/'
const RECALL_NUMBER = '/recall-number/'

// todo clean up api calls
// todo switch node fetch to axios

// returns an array of recalls
// each recall has an array of objects with properties of interest
// 'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014?format=json
async function GetRecalls (make, model, year, sessionId) {

  const url = HOST + RECALL + MAKE_NAME + make + MODEL_NAME + model + YEAR_RANGE + year + '-' + year

  try {
    const functionStart = (new Date()).getTime()

    const apiStart = (new Date()).getTime()
    let response = await fetch(url, { headers: { 'user-key': '2544a05ac53fafde54c828c248d5bf05' } })

    response = await response.json()
    const apiEnd = (new Date()).getTime()

    console.log(new ApiPerformanceLog({ sessionId: sessionId, measuring: 'Get Recalls API Query Call', request: url, executionTimeMilliSeconds: apiEnd - apiStart, notes: 'measuring single request' }))

    let recalls = []

    for (let index = 0; index < response.ResultSet.length; index++) {
      let recall = new Recall()

      for (let recallObj = 0; recallObj < response.ResultSet[index].length; recallObj++) {
        switch (response.ResultSet[index][recallObj]['Name']) {
          case 'Recall number':
            recall.recallNumber = response.ResultSet[index][recallObj]['Value']['Literal']

            break
          case 'Model name':
            recall.modelName = response.ResultSet[index][recallObj]['Value']['Literal']

            break
          default:
            break
        }
      }
      recalls.push(recall)
    }

    const functionEnd = (new Date()).getTime()
    console.log(new ApiPerformanceLog({ sessionId: sessionId, measuring: 'GetRecalls Function Total Execution Time', executionTimeMilliSeconds: functionEnd - functionStart, notes: 'measuring function time' }))
    return recalls.sort(compare)
  } catch (error) {
    console.error('RECALL API CALL FAILED', { sessionId: sessionId, request: url, error: error })
    throw error
  }
}

// http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/1977043?format=json
async function GetRecallDetails (recallNumber, locale, sessionId) {

  const url = HOST + RECALL_SUMMARY + RECALL_NUMBER + recallNumber

  try {
    const functionStart = (new Date()).getTime()

    const apiStart = (new Date()).getTime()

    let response = await fetch(url, { headers: { 'user-key': '2544a05ac53fafde54c828c248d5bf05' } })
    response = await response.json()

    const apiEnd = (new Date()).getTime()
    console.log(new ApiPerformanceLog({ sessionId: sessionId, measuring: 'Get Summary Query API Call', request: url, executionTimeMilliSeconds: apiEnd - apiStart, notes: 'measuring single request' }))

    // TODO: make a class
    // FIXME: remove time from date
    let recallDetails = new RecallSummary()

    // TODO:  add other available properties to object.
    // TODO: add some default value to switch statement.
    // result set returns model(s) (plural) affected by the targeted recall
    // outer loops through models affected by the targeted recall
    // outer loop only needs to loop once as the recall details does not change on various affected models.
    // inner loops through properties of the recall
    for (let recall = 0; recall < 1; recall++) {
      for (let recallObj = 0; recallObj < response.ResultSet[recall].length; recallObj++) {
        switch (response.ResultSet[recall][recallObj]['Name']) {
          case 'RECALL_DATE_DTE':
            const newDate = response.ResultSet[recall][recallObj]['Value']['Literal']
            const recallDate = new Date(newDate)
            if (locale === 'en-CA' || locale === 'fr-CA') {
              // EN-CA 11/06/2019 day/month/year reads June 6, 2019
              recallDetails.recallDate = `${recallDate.getDate()}/${recallDate.getMonth() + 1}/${recallDate.getFullYear()}`
            } else {
              // default to U.S. standard
              // EN-US 06/11/2019 month/ day/ year reads June 6, 2019
              recallDetails.recallDate = `${recallDate.getMonth() + 1}/${recallDate.getDate()}/${recallDate.getFullYear()}`
            }
            break
          case 'SYSTEM_TYPE_ETXT':
            recallDetails.componentType = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          case 'SYSTEM_TYPE_FTXT':
            if (locale === 'fr-CA') {
              recallDetails.componentType = response.ResultSet[recall][recallObj]['Value']['Literal']
            }
            break
          case 'UNIT_AFFECTED_NBR':
            recallDetails.unitsAffected = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          case 'COMMENT_ETXT':
            recallDetails.description = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          case 'COMMENT_FTXT':
            if (locale === 'fr-CA') {
              recallDetails.description = response.ResultSet[recall][recallObj]['Value']['Literal']
            }
            break
          case 'NOTIFICATION_TYPE_ETXT':
            recallDetails.notificationTypeEtxt = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          case 'RECALL_NUMBER_NUM':
            recallDetails.recallNumber = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          default:
            break
        }
      }
    }
    const functionEnd = (new Date()).getTime()
    console.log(new ApiPerformanceLog({ sessionId: 1, measuring: 'GetRecallDetails Function Total Execution Time', executionTimeMilliSeconds: functionEnd - functionStart, notes: 'measuring function time' }))

    return recallDetails
  } catch (error) {
    console.error('RECALL API CALL FAILED', { sessionId: sessionId, request: url, error: error })
    throw error
  }
}

function compare (a, b) {
  const recallA = a.recallNumber
  const recallB = b.recallNumber

  let comparison = 0
  if (recallA > recallB) {
    comparison = -1
  } else if (recallA < recallB) {
    comparison = 1
  }
  return comparison
}

module.exports = { GetRecalls: GetRecalls, GetRecallDetails }
