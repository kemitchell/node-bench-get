#!/usr/bin/env node
var program = require('commander');
var util = require('util');
var async = require('async');
var hyperquest = require('hyperquest');
program
  .version('0.0.1')
  .option('-n, --num_requests [num]', 'Number of total requests (n)')
  .option('-c, --concurrent [num]', 'Number of concurrent requests');

program.on('--help', function(){
  console.log('Url to hit is the last parameter');
  console.log('Example: nab -n 10 -c 5 "http://google.com/"')
  console.log('Example: benchget -n 10 -c 5 "http://google.com/"')
  console.log('Example: node index.js -n 10 -c 5 "http://google.com/"\n\n')
});

program.parse(process.argv);

if (program.concurrent)
    if ((program.num_requests % program.concurrent) !== 0) {
        console.log('Number of Requests must be a multiple of concurrent');
        process.exit(1);
    }

console.log(util.format('Running %s requests with a concurrency of %s', program.num_requests, program.concurrent));

var url =process.argv[process.argv.length - 1]
console.log('Url to test: ' + url);

var i = program.num_requests / program.concurrent;

responses = [];



function recurse (i, n, url, cbGroup, cbFinal, time) {
    if (i <= 0) return;
    var counter = 0;
    var subresults = [];
    var groupingSubTime = Date.now();
    responses[i] = [];
    for (var j = 0; j < n; j += 1) {
        var stream = hyperquest(url)
        var bufferdata = '';
        stream.on('data', function (buffer) {
            bufferdata += buffer.toString('utf8');
        });

        stream.on('end', function () {
            counter += 1;
            
            var idx  = subresults.push(bufferdata) - 1;

            responses[i].push(bufferdata);

            if (counter >= n) {
                cbGroup(subresults, groupingSubTime, i);
                i -= 1
                recurse(i, n, url, cbGroup, cbFinal, time);
            }
            if (i <= 0) {
                cbFinal(responses, time);
            }
        });
    }
}

recurse(i, parseInt(program.concurrent), url, 
    function (results, time, i) {
        console.log(util.format("Group(%s) took (%s ms) to Finish.", i, Date.now() - time));
    },
    function (results, time) { 
        console.log(util.format("All Tests finished in (%s ms)", Date.now() - time));
        console.log('There are ' + results.length + ' results');
    }, Date.now());
