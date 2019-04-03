'use strict'

const fetch = require('node-fetch')
const util = require('util')

const Recall = require('../models/recall').Recall
const RecallSummary = require('../models/recall').RecallSummary

const HOST = 'http://data.tc.gc.ca'
const PATH = '/v1.3/api/eng/vehicle-recall-database/'
const RECALL = 'recall'
const SUFFIX = '?format=json'
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
async function GetRecalls (make, model, year) {
  try {
    const url = HOST + PATH + RECALL + MAKE_NAME + make + MODEL_NAME + model + YEAR_RANGE + year + '-' + year + SUFFIX

    let response = await fetch(url)
    response = await response.json()
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
    return recalls.sort(compare)
  } catch (error) {
    console.log(error)
    throw error
  }
}

// http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/1977043?format=json
async function GetRecallDetails (recallNumber, locale) {
  try {
    const url = HOST + PATH + RECALL_SUMMARY + RECALL_NUMBER + recallNumber + SUFFIX

    let response = await fetch(url)
    response = await response.json()

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
            recallDetails.recallDate = response.ResultSet[recall][recallObj]['Value']['Literal'].split(' ')[0]
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
          case 'MODEL_NAME_NM':
            recallDetails.modelName = response.ResultSet[recall][recallObj]['Value']['Literal']
            break
          case 'MAKE_NAME_NM':
            recallDetails.makeName = response.ResultSet[recall][recallObj]['Value']['Literal']
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

    return recallDetails
  } catch (error) {
    console.error(error)
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
