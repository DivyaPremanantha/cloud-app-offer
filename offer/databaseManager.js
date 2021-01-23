'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveOffer = offer => {
	const params = {
		TableName: TABLE_NAME,
		Item: offer
	};

	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return offer.offerId;
		});
};

module.exports.getOffer = offerId => {
	const params = {
		Key: {
			offerId: offerId
		},
		TableName: TABLE_NAME
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			console.log("*****");
			console.log(result);
			return result.Offer;
		});
};

module.exports.deleteOffer = offerId => {
	const params = {
		Key: {
			offerId: offerId
		},
		TableName: TABLE_NAME
	};

	return dynamo.delete(params).promise();
};

module.exports.updateOffer = (offerId, paramsName, paramsValue) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			offerId
		},
		ConditionExpression: 'attribute_exists(offerId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};