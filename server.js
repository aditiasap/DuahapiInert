const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();

server.connection({
	port:1337
});

server.register(Inert, (err) => {
	// serve static html and image files
	server.route({
		method: 'GET',
		path: '/{files*}',
		handler: {
			// handle reply file starting from directory path onward
			directory: {
				path: __dirname
			}

/* Inert handler for reply static file
			,file: '404.html'
*/

		}
	});
	// return not found page if handler return 404
	server.ext('onPostHandler', function (request,reply) {
		const response = request.response;
		if(response.isBoom && response.output.statusCode === 404) {
			return reply.file('./404.html').code(404);
		}
		return reply.continue();
	});

	server.start((err) => {
		console.log(`Server running at: ${server.info.uri}`);
	});
});