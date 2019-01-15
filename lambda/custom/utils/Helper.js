// todo move helper functions to library

function GetSlotValues (filledSlots) {
  const slotValues = {}

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`)
  try {
    Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name

      if (filledSlots[item] &&
          filledSlots[item].resolutions &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
          filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        console.log('filling slots')
        console.log(filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code)
        console.log(name)
        switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case 'ER_SUCCESS_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
              isValidated: true
            }
            console.log('er_success_match')
            break
          case 'ER_SUCCESS_NO_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              resolved: filledSlots[item].value,
              isValidated: false
            }
            console.log('er_success_no_match')

            break
          default:
            break
        }
      } else {
        slotValues[name] = {
          synonym: filledSlots[item].value,
          resolved: filledSlots[item].value,
          isValidated: false
        }
        console.log('er_default')
      }
    }, this)
  } catch (error) {
    console.log('error: ', error)
  }
  console.log('returning slotvalues ', slotValues)

  return slotValues
}

module.exports = { GetSlotValues: GetSlotValues }
