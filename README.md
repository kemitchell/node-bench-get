benchget
==============

Simple Get benchmark command line similar to Apache Bench

  Usage: index.js,nab,benchget [options]

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -n, --num_requests [num]  Number of total requests (n)
    -c, --concurrent [num]    Number of concurrent requests

Url to hit is the last parameter
Example: nab -n 10 -c 5 "http://google.com/"
Example: benchget -n 10 -c 5 "http://google.com/"
Example: node index.js -n 10 -c 5 "http://google.com/"