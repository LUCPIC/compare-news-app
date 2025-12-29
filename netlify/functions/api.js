const serverless = require('serverless-http');
const app = require('../../backend/server');

const serverlessHandler = serverless(app);

module.exports.handler = async (event, context) => {
  console.log('--- Netlify Function Event Received ---');
  console.log('Path:', event.path);
  console.log('HTTP Method:', event.httpMethod);
  console.log('Query String Parameters:', JSON.stringify(event.queryStringParameters));
  console.log('-------------------------------------');
  
  // Proceed with the original handler
  return await serverlessHandler(event, context);
};
