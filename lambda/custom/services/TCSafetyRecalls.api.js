'use strict'

const fetch = require('node-fetch')
const util = require('util')

const HOST = 'http://data.tc.gc.ca'
const PATH = '/v1.3/api/eng/vehicle-recall-database/'
const RECALL = 'recall'
const SUFFIX = '?format=json'
const COUNT = '/count'
const MAKENAME = '/make-name/'
const MODELNAME = '/model-name/'
const YEARRANGE = '/year-range/'
const RECALLSUM = '/recall-summary/'
const RECALLNUMBER = '/recall-number/'

// todo clean up api calls
// todo place api in library
// todo switch node fetch to axios
// todo connect to airtable for string/resource files.

// 'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014/count?format=json
async function GetVehicleRecallCount (make, model, year) {
  console.log('inside func')
  try {
    var url = HOST + PATH + RECALL + MAKENAME + make + MODELNAME + model + YEARRANGE + year + '-' + year + COUNT + SUFFIX
    console.log(url)
    let res = await fetch(url)
    res = await res.json()
    console.log(util.inspect(res, { depth: null }))
    var count = res.ResultSet[0][0]['Value']['Literal']
    console.log('returning: ' + count)
    return count
  } catch (error) {
    return 0
  }
}

// todo fix, could return several recalls asscoiated to the vehicle
// 'http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall/make-name/honda/model-name/accord/year-range/2014-2014?format=json
async function GetRecalls (make, model, year) {
  console.log('function: GetRecallNumber')

  try {
    var url = HOST + PATH + RECALL + MAKENAME + make + MODELNAME + model + YEARRANGE + year + '-' + year + SUFFIX
    console.log(url)

    let res = await fetch(url)
    res = await res.json()
    var recallList = []

    console.log(url)
    for (let index = 0; index < res.ResultSet.length; index++) {
      // }
      let item = {
        recallNumber: null,
        modelName: null
      }
      for (let y = 0; y < res.ResultSet[index].length; y++) {
        switch (res.ResultSet[index][y]['Name']) {
          case 'Recall number':
            item.recallNumber = res.ResultSet[index][y]['Value']['Literal']

            break
          case 'Model name':
            item.modelName = res.ResultSet[index][y]['Value']['Literal']

            break
          default:
            break
        }
      }
      recallList.push(item)
    }
    return recallList
  } catch (error) {
    return 0
  }
}

// http://data.tc.gc.ca/v1.3/api/eng/vehicle-recall-database/recall-summary/recall-number/1977043?format=json
async function GetRecallDetails (recallNumber) {
  // recallNumber = 2011116
  try {
    var url = HOST + PATH + RECALLSUM + RECALLNUMBER + recallNumber + SUFFIX

    console.log('url',url)
    let res = await fetch(url)
    res = await res.json()

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
    for (let recall = 0; recall < res.ResultSet.length; recall++) {
      for (let recallProperty = 0; recallProperty < res.ResultSet[recall].length; recallProperty++) {
        switch (res.ResultSet[recall][recallProperty]['Name']) {
          case 'RECALL_DATE_DTE':
            recallDetails.recallDate = res.ResultSet[recall][recallProperty]['Value']['Literal']
            break
          case 'SYSTEM_TYPE_ETXT':
            recallDetails.componentType = res.ResultSet[recall][recallProperty]['Value']['Literal']
            break
          case 'UNIT_AFFECTED_NBR':
            recallDetails.unitsAffected = res.ResultSet[recall][recallProperty]['Value']['Literal']
            break
          case 'COMMENT_ETXT':
            recallDetails.description = res.ResultSet[recall][recallProperty]['Value']['Literal']
            break
          case 'MODEL_NAME_NM':
            recallDetails.modelName = res.ResultSet[recall][recallProperty]['Value']['Literal']
            console.log('model_name: ', recallDetails.modelName)
            break
          case 'MAKE_NAME_NM':
            recallDetails.makeName = res.ResultSet[recall][recallProperty]['Value']['Literal']
            console.log('makename: ', recallDetails.makeName)
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

GetRecallDetails('2017327').then(function (result) {
  console.log(result)
})

module.exports = { GetVehicleRecallCount, GetRecalls: GetRecalls, GetRecallDetails }
