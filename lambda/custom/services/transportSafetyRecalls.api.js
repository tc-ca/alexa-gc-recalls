'use strict'

const fetch = require('node-fetch')
const util = require('util')

const HOST = 'http://data.tc.gc.ca'
const PATH = '/v1.3/api/eng/vehicle-recall-database/'
const RECALL = 'recall'
const SUFFIX = '?format=json'
const MAKENAME = '/make-name/'
const MODELNAME = '/model-name/'
const YEARRANGE = '/year-range/'
const RECALLSUM = '/recall-summary/'
const RECALLNUMBER = '/recall-number/'

// todo clean up api calls
// todo place api in library
// todo switch node fetch to axios

// todo fix, could return several recalls asscoiated to the vehicle
// 'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014?format=json
async function GetRecalls (make, model, year) {
  try {
    const url = HOST + PATH + RECALL + MAKENAME + make + MODELNAME + model + YEARRANGE + year + '-' + year + SUFFIX

    let response = await fetch(url)
    response = await response.json()
    let recalls = []

    for (let recall = 0; recall < response.ResultSet.length; recall++) {
      let item = {
        recallNumber: null,
        modelName: null
      }
      for (let recallObj = 0; recallObj < response.ResultSet[recall].length; recallObj++) {
        switch (response.ResultSet[recall][recallObj]['Name']) {
          case 'Recall number':
            item.recallNumber = response.ResultSet[recall][recallObj]['Value']['Literal']

            break
          case 'Model name':
            item.modelName = response.ResultSet[recall][recallObj]['Value']['Literal']

            break
          default:
            break
        }
      }
      recalls.push(item)
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
    const url = HOST + PATH + RECALLSUM + RECALLNUMBER + recallNumber + SUFFIX

    let response = await fetch(url)
    response = await response.json()

    // TODO: make a class
    // FIXME: remove time from date
    let recallDetails = {
      recallDate: null,
      componentType: null,
      unitsAffected: null,
      description: null,
      makeName: null,
      modelName: null
    }

    // TODO:  add other available properties to object.
    // TODO: add some default value to switch statement.
    // result set returns model(s) (plural) affected by the targeted recall
    // outer loops through models affected by the targeted recall
    // outer loop only needs to loop once as the recall details does not change on various affected models.
    // inner loops through properties of the recall
    for (let recall = 0; recall < response.ResultSet.length; recall++) {
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
          default:
            break
        }
      }
    }

    return recallDetails
  } catch (error) {
    return 0
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
