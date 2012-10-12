new Error().stack;
var restify = require('restify');
var fs = require('fs');
var dtp = require('dtrace-provider').createDTraceProvider('echofile-server');

dtp.addProbe('echo-start', 'char *');
dtp.addProbe('echo-done', 'char *', 'char *', 'int');

dtp.enable();

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/^\/(.*)/, function (req, res, next) {

    dtp.fire('echo-start', function() {
	return [req.params[0]];
    });

    fs.readFile(req.params[0], 'utf8', function(e, data) {
	var payload;

	if (e) {
            if (e.code == 'ENOENT') {
		console.error(new Error('File: ' + req.params[0] + ' does not exist.'));
	    } else {
		console.error(new Error('Error reading: ' + req.params[0] + ' ' + JSON.stringify(e)));
	    }
	    payload = e.toString();
	    res.send(payload);
	} else {
	    payload = data.toString();
	    res.send(payload);
	}
	dtp.fire('echo-done', function() {
	    return [req.params[0], e  && e.code ? e.code : null, data ? data.length : 0];
	});

    });

    return next();
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
