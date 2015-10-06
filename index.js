var net = require('net');
var Promise = require('promise');


var actualPromise = null;
var channelsToRead = 2;
var output = 0;

var client = new net.Socket();

client.on('data', function(data) {
  if(actualPromise) {
    client.pause();
    actualPromise.resolve(data.toString());
  }
}); 

var read = function(channel) {
  client.resume();
  var promise = new Promise(function(_resolve, _reject){
    actualPromise = {resolve: _resolve, reject: _reject};  
    client.write('READ '+(channel));
  })
  .then(function(res){
    console.log(channel);
    if(channel < channelsToRead-1) read(++channel);
    else process();
  });
}

var process = function() {
  var promise = new Promise(function(_resolve, _reject) {
    output += 0.01;
    _resolve(output);
  })
  .then(function(res){
    console.log(res);
    client.write('WRITE 0 '+(res.toString()));
  });
} 

client.connect(20081, '127.0.0.1', function(){
  console.log('connected');

  setInterval(function(){
    read(0);
  },100);

});
