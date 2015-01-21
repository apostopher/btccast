/**
 * Created by Rahul on 19/1/15.
 */


var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var compress = require('compression');
var cons = require('consolidate');
var request = require('request');

var config = require('./config/config');

var app = express();

app.use(compress());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(__dirname + '/../client'));

app.engine('html', cons.swig);

// set .html as the default extension
app.set('view engine', 'html');
app.set('views', __dirname + '/../client');

app.get('/', function(req, res){
  'use strict';
  res.render('index');
});

app.get('/lastprice', function(req, res){
  'use strict';
  request.get('https://www.bitstamp.net/api/ticker/', function(error, response, body){
    console.log(body.last);
    if(error){
      res.status(404).send(error);
    }
    res.send(+body.last);
  });
});

var server = app.listen((config.port || 3000), onStart);

//Implementation ---
function onStart() {
  'use strict';
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
}


