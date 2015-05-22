// Dynamic Rad Example
// Pulls latest 10 instagrams for an account
// Uploads it to Adieu.io
//
// To use, create an Adieu.io account, then add a new board
// and then "Upload"->"Api" to retrive the board token.
//
//  find your instagramId here: http://stackoverflow.com/questions/11796349/instagram-how-to-get-my-user-id-from-username
//
//  example:
//  % node instagram 2682274

'use strict';

var adieu = require('adieu-api');
var _ = require('lodash');
var async = require('async');
var request = require('request');

var instagram = require('instagram-node').instagram();


//
// LOAD OUR CONFIGURATION
//
var boardToken = process.env['ADIEU_BOARD_TOKEN'];
var instagramToken = process.env['INSTAGRAM_API_TOKEN'];

if (!boardToken) {
  console.log("set ADIEU_BOARD_TOKEN first: export ADIEU_BOARD_TOKEN=...");
  process.exit(1);
}

if (instagramToken) {
  instagram.use({
    access_token: adieuInstagramToken
  }); // sample adieu token
} else {
  // using the sample app api
  console.warn('----------=> Using the sample, borrowed api credentials. Please get your own to use this in production. https://instagram.com/developer/');
  instagram.use({
    client_id: '0de69a63d91b41029fc2cd2531d3f0af',
    client_secret: '72208ecf41ee4d0e96e94f3bef55eabb'
  });
}

var UPDATE_PERIOD = 5 * 60 * 1000; // check for updates from instragram every 5min .. in ms

//
// READ COMMAND LINE OPTIONS
//
var args = process.argv.slice(2);
if (!args[0]) {
  console.log('Usage: ' + process.argv[1] + ' instagramIDnotScreenname');
  process.exit(1);
}
var instagramId = args[0];
var daemon = args[1]; // if anything, we will run as a daemon

//
// START
//
var processed = {};
fetch();

function getLatest(instagramId, callback) {

  instagram.user_media_recent(instagramId, {}, function(err, medias, pagination, remaining, limit) {
    if (err) {
      console.log('error retrieving user?', err);
      callback(err);
      return;
    }

    var images = [];
    _.each(medias, function(media) {
      var image = media.images.standard_resolution;
      if (image) {
        images.push(image);
      }
    });

    callback(null, images);
  });
}

function fetch() {

  getLatest(instagramId, function(err, imageUrls) {

    if (err) {
      console.log('error fetching', err);
      process.exit(1);
    }

    // for each image, see if we've done this or not
    // see how many rads we currently have in this board
    adieu.getBoard(boardToken, function(err, board) {
      if (err) {
        console.log('error retrieving adieu board', err);
        process.exit(1);
      }
      board = board.board;

      // we limit ourself to 20 individual rads within the board
      // so if the number of rads > 20, we'll be overwriting
      var MAX_RADS = 20;
      var radIds = new Array(MAX_RADS);
      var count = 0;

      async.eachSeries(imageUrls, function(image, cb) {
        // download the image here, then upload it to adieu.
        if (processed[image.url]) {
          console.log('skipping ' + image.url + ' already done.');
          cb();
          return;
        }
        if (count > MAX_RADS) {
          console.log('too many results, only adding first '+MAX_RADS);
          cb();
          return;
        }
        request.get({
          url: image.url,
          encoding: null // return a buffer, not a string
        }, function(err, response, body) {
          if (err) {
            console.log('could not retreive image: ' + image.url + '\n', err);
            cb();
            return;
          }

          if (image.url) {
            processed[image.url] = true;
            count++;
          }

          var rad = {};
          if ( (count + board.rads.length) < MAX_RADS) {
            rad.id = '';
          } else {
            rad.id = board.rads[ (count+board.rads.length) % MAX_RADS] || '';
          }
          rad.data = body.toString('base64');
          adieu.addRad(boardToken, rad, function(err, results) {
            if (!err) {
              console.log('image added to adieu ok.', results);
              cb();
              return;
            } else {
              console.log('error adding image.', err);
              cb();
            }
          });
        });

      }, function(err) {
        // done
        console.log('completed.');
        if (daemon) {
          console.log('Waiting ' + UPDATE_PERIOD + ' to try again.');

          setTimeout(function() {
            console.log('checking for updates...');
            fetch();
          }, UPDATE_PERIOD);
        }
      });
    });
  });
}
