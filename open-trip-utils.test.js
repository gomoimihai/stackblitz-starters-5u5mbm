const { validateCoordinatesString, validateMode, validateTimestamp, parseTimestamp, calculateEmissions, MODES } = require('../src/open-trip-utils')

describe('when validating coordinate strings', () => {
  it('should return true for coordinates string with decimals', () => {
    expect(validateCoordinatesString('60.148156622692035,24.987887975719225')).toBe(true)
  })

  it('should return true for coordinates string with negative values', () => {
    expect(validateCoordinatesString('-18.345345345,179.345345353')).toBe(true)
    expect(validateCoordinatesString('123.345,-123.7')).toBe(true)
  })

  it('should return true for coordinates without decimals', () => {
    expect(validateCoordinatesString('0,0')).toBe(true)
    expect(validateCoordinatesString('12,46')).toBe(true)
    expect(validateCoordinatesString('123,0')).toBe(true)
  })

  it('should return true for coordinates string with decimals', () => {
    expect(validateCoordinatesString('12,13')).toBe(true)
  })

  it('should return false for invalid coordinates string', () => {
    expect(validateCoordinatesString('')).toBe(false)
    expect(validateCoordinatesString(null)).toBe(false)
    expect(validateCoordinatesString(undefined)).toBe(false)
    expect(validateCoordinatesString('60.148156622692035')).toBe(false)
    expect(validateCoordinatesString('123,')).toBe(false)
    expect(validateCoordinatesString(',13.4575667')).toBe(false)
    expect(validateCoordinatesString('afddg,dfgd')).toBe(false)
    expect(validateCoordinatesString('1d24d.3gd4,123.4s6')).toBe(false)
    expect(validateCoordinatesString('45.5,51.783453,92.724353')).toBe(false)
  })
})

describe('when validating modes', () => {
  it('should return true for modes contained in the modes enum', () => {
    expect(validateMode([MODES.AIRPLANE])).toBe(true)
    expect(validateMode([MODES.BICYCLE, MODES.CABLE_CAR])).toBe(true)
    expect(validateMode([MODES.CAR, MODES.BUS, MODES.RAIL])).toBe(true)
  })

  it('should return false for invalid mode formats', () => {
    expect(validateMode(MODES.TRANSIT)).toBe(false)
    expect(validateMode(12)).toBe(false)
    expect(validateMode(null)).toBe(false)
    expect(validateMode(undefined)).toBe(false)
    expect(validateMode([])).toBe(false)
  })

  it('should return false for mode values not included in the modes enum', () => {
    expect(validateMode([MODES.TRAM, 'TELEPORTATION', 'WARP DRIVE'])).toBe(false)
    expect(validateMode(['LEVITATION'])).toBe(false)
  })
})

describe('when validating timestamp', () => {
  it('should return true for a valid timestamp', () => {
    const timestamp = Date.now()
    expect(validateTimestamp(timestamp)).toBe(true)
  })

  it('should return true for a timestamp equal to the current date', () => {
    const timestamp = new Date().setHours(0, 0, 0, 0)
    expect(validateTimestamp(timestamp)).toBe(true)
  })

  it('should return false for a non-integer timestamp', () => {
    const timestamp = 123.45
    expect(validateTimestamp(timestamp)).toBe(false)
  })

  it('should return false for a timestamp earlier than today ', () => {
    const timestamp = Date.now() - 86400001
    expect(validateTimestamp(timestamp)).toBe(false)
  })

  it('should return false for a negative timestamp', () => {
    const timestamp = -123456789
    expect(validateTimestamp(timestamp)).toBe(false)
  })
})

describe('when parsing the timestamp', () => {
  it('should parse the timestamp correctly', () => {
    const timestamp = Date.UTC(2023, 5, 15, 12, 30, 0)

    const expectedOutput = {
      time: '12:30',
      dateString: '6-15-2023'
    }

    expect(parseTimestamp(timestamp)).toEqual(expectedOutput)
  })
})

describe('when calculating emissions', () => {
  it('should calculate emissions correctly for a single itinerary', () => {
    const itineraries = [
      {
        legs: [
          {
            mode: MODES.CAR,
            distance: 50000
          },
          {
            mode: MODES.TRAM,
            distance: 100000
          },
          {
            mode: MODES.BUS,
            distance: 30000
          }
        ]
      }
    ]

    const expectedOutput = [
      {
        legs: [
          {
            mode: MODES.CAR,
            distance: 50000,
            co2: 8000
          },
          {
            mode: MODES.TRAM,
            distance: 100000,
            co2: 5400
          },
          {
            mode: MODES.BUS,
            distance: 30000,
            co2: 2220
          }
        ]
      }
    ]

    expect(calculateEmissions(itineraries)).toEqual(expectedOutput)
  })

  it('should handle legs with missing distance or unknown multiplier', () => {
    const itineraries = [
      {
        legs: [
          {
            mode: MODES.CAR,
            distance: 60000
          },
          {
            mode: 'BIFROST',
            distance: 20000
          },
          {
            distance: 80000
          },
          {
            mode: MODES.BUS
          }
        ]
      }
    ]

    const expectedOutput = [
      {
        legs: [
          {
            mode: MODES.CAR,
            distance: 60000,
            co2: 9600
          },
          {
            mode: 'BIFROST',
            distance: 20000,
            co2: 0
          },
          {
            distance: 80000,
            co2: 0
          },
          {
            mode: MODES.BUS,
            co2: 0
          }
        ]
      }
    ]

    expect(calculateEmissions(itineraries)).toEqual(expectedOutput)
  })
})
