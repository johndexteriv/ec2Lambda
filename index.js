"use strict";
// require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const URI = process.env.URI;

let cachedDB = null;

function connectToDatabase(uri, options) {
	console.log("=> connect to database");
	console.log(uri);

	// if (cachedDB) {
	// 	console.log("=> using cached database instance");
	// 	return Promise.resolve(cachedDB);
	// }

	return MongoClient.connect(uri, options)
		.then((client) => {
			cachedDB = client.db("asgm");
			return cachedDB;
		})
		.catch((err) => console.log(err));
}

function queryDatabase(db) {
	console.log("=> query database");

	return db
		.listCollections()
		.toArray()
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log("=> an error occured: ", err);
			return { statusCode: 500, body: "error" };
		});
}

exports.handler = (event, context, callback) => {
	context.callbackWaitsForEmptyEventLoop = false;

	console.log("event: ", event);
	const URIstring = URI;

	connectToDatabase(URIstring, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then((db) => {
			console.log(db);
			return queryDatabase(db);
		})
		.then((result) => {
			var collections = result.map((collection) => collection.name);
			console.log("=> returning result: ", result);
			console.log(URIstring);
			callback(null, collections);
		})
		.catch((err) => {
			// e.printStackTrace
			console.log("=> an error occurred: ", err);
			callback(err);
		});
};
