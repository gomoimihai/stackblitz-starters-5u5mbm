const openTripApi = require('./open-trip-api')

exports.main = async (event) => {
  return openTripApi.fetchRoutePlan(JSON.parse(event.body)).then((resp) => ({
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resp)
  })).catch((err) => ({
    statusCode: 400,
    body: err.message
  }))
}
