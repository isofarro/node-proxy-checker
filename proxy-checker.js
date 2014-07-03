var http = require('http'),
    myIP = require('my-ip'),
    events = require('events'),
    localIP = myIP(),
    checkUrl = 'http://www.goldenpirates.org/proxy/azenv.php',
    timeout  = 5;


function ProxyChecker() {
    events.EventEmitter.call(this);
};

ProxyChecker.prototype.__proto__ = events.EventEmitter.prototype;

ProxyChecker.prototype.check = function(proxy) {
    var segments = proxy.split(':'),
        checker,
        options = {
            host: segments[0],
            port: segments[1],
            path: checkUrl,
            method: 'GET'
        },
        self = this;

    checker = http.request(options, function(response) {
        var buffer = [];
        //console.log('STATUS: ' + response.statusCode);

        response.setEncoding('utf8');
        response.on('data', function(chunk) {
    	    buffer.push(chunk);
        });

        response.on('end', function() {
    	    var body = buffer.join(''),
                isListed = (body.indexOf(localIP) !== -1);

    	    if (isListed) {
                //console.log('[-FAIL-] Proxy ' + options.host + ':' + options.port);
                self.emit('fail', proxy);
            } else {
                //console.log('[-PASS-] Proxy ' + options.host + ':' + options.port);
                self.emit('pass', proxy);
            }
        });

        response.on('error', function(e) {
            console.log('problem with response: ' + e.message);
            self.emit('fail', proxy);
        });
    });

    checker.on('error', function(e) {
        //console.log('problem with request: ' + e.message);
        self.emit('fail', proxy);
    });

    checker.on('socket', function(socket) {
        socket.setTimeout(timeout * 1000);
        socket.on('timeout', function() {
            checker.abort();
        });
    });

    checker.end();
};



module.exports = {
    check: function(proxy, options) {
        var checker = new ProxyChecker();
        checker.on('pass', function() {
            if (options.pass) {
                options.pass(proxy);
            }
        });
        checker.on('fail', function() {
            if (options.fail) {
                options.fail(proxy);
            }
        });

        checker.check(proxy);
    }
};
