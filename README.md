# Open Trip Emissions Calculations

Requests a trip for the open trip api and appends the co2 emissions based on the predefined multipliers.

## Assumptions

Some of the transit modes in the exercise description did not exist and some were missing. I used only those found in the open api docs.

## Solution formulation

An API Gateway is called with a POST request and a JSON payload configured as a trigger over the lambda function which contains the logic to call the open trip api and enrich the data with the co2 emissions.
The Lambda must have the AWS-Parameters-and-Secrets-Lambda-Extension layer configured in order to be able to access the open trip api key from the AWS Secrets Manager.
A secret named "open-trip-api-key" configured in the AWS Secrets Manager, with read permissions given to the Lambda Function execution role.

POST Payload (JSON):

{  
    &nbsp;&nbsp;fromPlace: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: string , // proper format consist of two geographical coordinates separated by a comma. eg. 12.34,56.78  
        &nbsp;&nbsp;&nbsp;&nbsp;required: true  
    &nbsp;&nbsp;},   
    &nbsp;&nbsp;toPlace: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: string , // proper format consist of two geographical coordinates separated by a comma. eg. 12.34,56.78  
        &nbsp;&nbsp;&nbsp;&nbsp;required: true  
    &nbsp;&nbsp;},   
    &nbsp;&nbsp;mode: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: [string], // one or more of the following WALK, TRANSIT, BICYCLE, BICYCLE_RENT, BICYCLE_PARK, CAR, CAR_PARK, TRAM, SUBWAY, RAIL, BUS, CABLE_CAR, FERRY, GONDOLA, FUNICULAR, AIRPLANE  
        &nbsp;&nbsp;&nbsp;&nbsp;default: TRANSIT  
    &nbsp;&nbsp;},   
    &nbsp;&nbsp;timestamp: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: number,  
        &nbsp;&nbsp;&nbsp;&nbsp;default: Date.now()  
    &nbsp;&nbsp;},  
    &nbsp;&nbsp;arriveBy: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: boolean,  
        &nbsp;&nbsp;&nbsp;&nbsp;default: false  
    &nbsp;&nbsp;},  
    &nbsp;&nbsp;wheelChair: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: boolean,  
        &nbsp;&nbsp;&nbsp;&nbsp;default: false  
    &nbsp;&nbsp;},  
    &nbsp;&nbsp;showIntermediateStops: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: boolean,  
        &nbsp;&nbsp;&nbsp;&nbsp;default: true  
    &nbsp;&nbsp;},  
    &nbsp;&nbsp;locale: {  
        &nbsp;&nbsp;&nbsp;&nbsp;type: string,  
        &nbsp;&nbsp;&nbsp;&nbsp;default: 'en'  
    &nbsp;&nbsp;}  
}  

Regarding unit tests, the logic in "open-trip-utils.js" is covered. The "open-trip-api.js" is just a wrapper over the open trip api itself and should fall under API testing rather than unit testing.

## Libraries/Tools used

### Deployment
AWS CDK

### Dev Stack
Node 18
Jest
EsLint

## How to setup
1. Install AWS CLI, CDK CLI and node 18.x

2. Configure the AWS CLI with a user which has access to AWS Lambda.

3. Run the following commands
npm install
cdk bootstrap
cdk deploy

Configure API GATEWAY as trigger over the lambda function
Create a secret in the AWS Secrets Manager called "open-trip-api-key" and add read permission to the Lambda execution role.

Call the API endpoint with a POST request and a valid payload.

To run tests run "npm test"

I also have a live version on this URL: [url](https://j5dn5msr9a.execute-api.us-east-1.amazonaws.com)

Example request:

curl -d '{ "fromPlace": "60.148156622692035,24.987887975719225", "toPlace": "60.19461994799159,24.870836734771732"}' -H "Content-Type: application/json" -X POST https://j5dn5msr9a.execute-api.us-east-1.amazonaws.com

## Decisions and tradeoffs

I've decided to use as little tools as possible in order to better showcase my capabilities. In my opinion it is more difficult to implmenet something without advanced tooling.

I did not implement the wrapper over the entire open trip api. As this is purely an exercise I have chosen some things just to showcase the implementation. It becomes repetetive work from this point on.

The wrapper over the open api uses a JSON format instead of query params. Considering that third party apis we depend on are subject to change, wrappers should implement a clear, easy to maintain contract which then parses the input data in the format that the third party api requires. In this scenario I believe that a JSON is a better option than mapping one on one the query params of the original open trip api.

## If it was a bigger project

I would have used more advanced tooling. For example a framework over node (like express), a more strict linting configuration and typescript.

Also a deployment pipline would be required.
