const MODES = Object.freeze({
  WALK: 'WALK',
  TRANSIT: 'TRANSIT',
  BICYCLE: 'BICYCLE',
  BICYCLE_RENT: 'BICYCLE_RENT',
  BICYCLE_PARK: 'BICYCLE_PARK',
  CAR: 'CAR',
  CAR_PARK: 'CAR_PARK',
  TRAM: 'TRAM',
  SUBWAY: 'SUBWAY',
  RAIL: 'RAIL',
  BUS: 'BUS',
  CABLE_CAR: 'CABLE_CAR',
  FERRY: 'FERRY',
  GONDOLA: 'GONDOLA',
  FUNICULAR: 'FUNICULAR',
  AIRPLANE: 'AIRPLANE'
})

const EMISSION_MULTIPLIERS = Object.freeze({
  [MODES.WALK]: 0,
  [MODES.TRANSIT]: 74,
  [MODES.BICYCLE]: 0,
  [MODES.BICYCLE_RENT]: 0,
  [MODES.BICYCLE_PARK]: 0,
  [MODES.CAR]: 160,
  [MODES.CAR_PARK]: 0,
  [MODES.TRAM]: 54,
  [MODES.SUBWAY]: 74,
  [MODES.RAIL]: 14,
  [MODES.BUS]: 74,
  [MODES.CABLE_CAR]: 54,
  [MODES.FERRY]: 144,
  [MODES.GONDOLA]: 54,
  [MODES.FUNICULAR]: 54,
  [MODES.AIRPLANE]: 144
})

// #region Validators
exports.validateCoordinatesString = (coordinatesString) => {
  if (typeof coordinatesString !== 'string') {
    return false
  }

  const coordinateRegex = /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/g

  if (!coordinateRegex.test(coordinatesString)) {
    return false
  }

  return true
}

exports.validateMode = (mode) => Array.isArray(mode) && !!mode.length && mode.every((modeItem) => MODES[modeItem])

exports.validateTimestamp = (timestamp) => {
  if (!Number.isInteger(timestamp)) {
    return false
  }

  if (new Date().toDateString() !== new Date(timestamp).toDateString() && (Date.now() - timestamp > 0 || timestamp < 0)) {
    return false
  }

  return true
}
// #endregion

// #region Computations
exports.parseTimestamp = (timestamp) => {
  const date = new Date(timestamp)

  const time = `${date.getUTCHours()}:${date.getUTCMinutes()}`

  const dateString = `${
      date.getUTCMonth() + 1
    }-${date.getUTCDate()}-${date.getUTCFullYear()}`

  return { time, dateString }
}

exports.calculateEmissions = (itineraries) =>
  itineraries.map((itinerary) => ({
    ...itinerary,
    legs: itinerary.legs.map((leg) => {
      const co2 = EMISSION_MULTIPLIERS[leg.mode] && leg.distance ? Math.round(leg.distance / 1000 * EMISSION_MULTIPLIERS[leg.mode]) : 0

      return { ...leg, co2 }
    })
  }))

// #endregion

exports.MODES = MODES
