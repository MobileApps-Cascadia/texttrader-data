const registerService = require('./services/register');
const loginService = require('./services/login');
const verifyService = require('./services/verify');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
   console.log('Request Event: ', event);
   let response;
   switch (true) {
       case event.httpMethod === 'GET' && event.path === healthPath:
           response = util.buildResponse(200)
           break;
       case event.httpMethod === 'POST' && event.path === registerPath :
           const registerBody = JSON.parse(event.body);
           response = await registerService.register(registerBody);
           break;
        case event.httpMethod === 'POST' && event.path === loginPath :
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
           break;
        case event.httpMethod === 'POST' && event.path === verifyPath :
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
           break;
       default:
           response = util.buildResponse(404, '404 Not found');
   }
   return response;
};

//Simple books code

'use strict';
console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();


exports.handler = function(event, context, callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        payload: err ? err.message : res,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var operation = event.operation;

    if (event.tableName) {
        event.payload.TableName = event.tableName;
    }

    switch (operation) {
        case 'create':
            dynamo.put(event.payload, done);
            break;
        case 'read':
            dynamo.get(event.payload, done);
            break;
        case 'update':
            dynamo.put(event.payload, done);
            break;
        case 'delete':
            dynamo.delete(event.payload, done);
            break;
        case 'list':
            dynamo.scan(event.payload, done);
            break;
        case 'echo':
            callback(null, "Success");
            break;
        case 'ping':
            callback(null, "pong");
            break;
        default:
            done('Unknown operation: ${operation}');
    }
};

