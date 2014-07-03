Proxy checker
=============

Checks whether an HTTP proxy server does suitably anonymise the user. Grab a list of proxy servers from your favourite website, format each proxy as `PROXY_IP:PROXY_PORT` and run then through `node check.js` which will return the list of proxies that work and don't expose your IP address (aka Elite Proxy). Run your clean list through a few times will clean out some of the unstable proxies.


Usage:

    node check.js *inputFile* [outputFile]


Examples:

    node check.js proxy-list-to-check.txt

Tests each proxy listed in `proxy-list-to-check.txt`, and writes out those that work and do not expose the user's IP address to the STDOUT.


    node check.js proxy-list-to-check.txt clean-list.txt

Tests each proxy listed in `proxy-list-to-check.txt` and writes the ones that do anonymise appropriately to `clean-list.txt`

The format of a proxy server is:

    [PROXY_IP]:[PROXY_PORT]


