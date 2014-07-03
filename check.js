var checkProxy = require('./proxy-checker'),
    fs         = require('fs'),
    DELAY = 200,
    stats = {
        total: 0,
        inProgress: 0,
        pass: 0,
        fail: 0,
        error: 0
    },
    inputFile  = '',
    outputFile = '',
    output,
    args = process.argv.slice(2),
    proxyList,
    listSize;


if (args[0]) {
    inputFile = args[0];
}

if (args[1]) {
    output = fs.openSync(args[1], 'a');
}


proxyList = fs.readFileSync(inputFile, 'utf8').split('\n');
listSize  = proxyList.length;


var ticker = setInterval(function() {
    proxy = proxyList.pop();
    listSize = proxyList.length;

    if (proxy) {
        stats.total++;
        stats.inProgress++;

        checkProxy.check(proxy, {
            pass: function(proxy) {
                //console.log('Pass: ' + proxy);

                if (output) {
                    fs.write(output, proxy + "\n");
                    process.stdout.write('#');
                } else {
                    console.log(proxy);
                }

                stats.pass++;
                stats.inProgress--;
            },
            fail: function(proxy) {
                //process.stdout.write('.');

                if (output) {
                    process.stdout.write('F');
                }

                stats.fail++;
                stats.inProgress--;
            },
            error: function(proxy, message) {
                if (output) {
                    //console.log('\n' + proxy + ': ' + message);
                    process.stdout.write('.');
                }

                stats.error++;
                stats.inProgress--;
            }
        });

    } else if (stats.inProgress || listSize) {
        // Keep ticking as proxy checks are in progress
    } else {
        clearInterval(ticker);
        delete stats.inProgress;

        if (output) {
            fs.closeSync(output);
            console.log('');
            console.log(stats);
        }
    }
}, DELAY);


