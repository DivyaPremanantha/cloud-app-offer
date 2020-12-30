// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const databaseManager = require('./databaseManager');
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

exports.offerHandler = async (event) => {
	console.log(event);

	switch (event.httpMethod) {
		case 'DELETE':
			return deleteOffer(event);
		case 'GET':
			return getOffer(event);
		case 'POST':
			return saveOffer(event);
		case 'PUT':
			return updateOffer(event);
		default:
			return sendResponse(404, `Unsupported method "${event.httpMethod}"`);
	}
};

exports.addOffer = async (event) => {
	console.log(event);
	const dynamodb = event.Records[0].dynamodb;
    console.log(dynamodb);
	const price = dynamodb.NewImage.price.N;

	const formData = {
		offer : dynamodb.NewImage.user.S,
		message: "You have an offer"
	}
	
	if (price > 200) {
		return saveOffer(formData);
	}
};

function saveOffer(event) {
	const offer = JSON.parse(event);
	offer.offerId = Math.floor(100000 + Math.random() * 900000).toString();

	return databaseManager.saveOffer(offer).then(response => {
		console.log(response);
		return sendResponse(200, offer.offerId);
	});
}

function getOffer(event) {
	const offerId = event.pathParameters.offerId;

	return databaseManager.getOffer(offerId).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function deleteOffer(event) {
	const offerId = event.pathParameters.offerId;

	return databaseManager.deleteOffer(offerId).then(response => {
		return sendResponse(200, 'DELETE OFFER');
	});
}

function updateOffer(event) {
	const offerId = event.pathParameters.offerId;

	const body = JSON.parse(event.body);
	const paramName = body.paramName;
	const paramValue = body.paramValue;

	return databaseManager.updateOffer(offerId, paramName, paramValue).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function sendResponse(statusCode, message) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	return response
}
