const lambda = require('aws-cdk-lib/aws-lambda')
const cdk = require('aws-cdk-lib')
const path = require('path')
const { Stack } = require('aws-cdk-lib')

class OpenTripStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor (scope, id, props) {
    super(scope, id, props)

    // eslint-disable-next-line no-unused-vars
    const lambdaFunction = new lambda.Function(this, 'open-trip', {
      runtime: lambda.Runtime.NODEJS_18_X,
      // memorySize: 1024,
      // timeout: cdk.Duration.seconds(5),
      handler: 'index.main',
      code: lambda.Code.fromAsset(path.join(__dirname, '/../src')),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(this, 'Layer', 'arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:4')
      ],
      environment: {
        REGION: cdk.Stack.of(this).region,
        AVAILABILITY_ZONES: JSON.stringify(
          cdk.Stack.of(this).availabilityZones
        ),
        OPEN_TRIP_PLANNER_ENDPOINT: 'finland-staging.trip-planner.maas.global',
        OPEN_TRIP_PLANNER_PATH: '/otp/routers/default/plan',
        PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: 'true'
      }
    })
  }
}

module.exports = { OpenTripStack }
