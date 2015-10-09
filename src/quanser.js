  var net = require('net');

  var Promise = require('promise');

module.exports = function() {  

  var actualPromise = null;
  var channelsToRead = 2;
  var output = 0;
  
  var client = new net.Socket();

  var _config = {
    controlType: "manual",
    controller: {
      serie: {
        type: "P",
        P: 1,
        I: 0,
        D: 0
      },
      cascade:{
        master:{
          type: "P",
          P: 1,
          I: 0,
          D: 0
        },
        slave:{
          type: "P",
          P: 1,
          I: 0,
          D: 0
        }
      }
    } 

  };

  var _outputs = {
    sensors: [0,0],
  };
; 

  var read = function(channel) {
    var _this = this;
    var promise = new Promise(function(_resolve, _reject){
      _this.actualPromise = {resolve: _resolve, reject: _reject};  
        _this.client.write('READ '+(channel)+'\n');

    })
    .then(function(res){
      //console.log('THEN READ '+channel+' '+res);
      _this.outputs.sensors[channel] = +res*6.25;
      if(channel < channelsToRead-1) _this.read(++channel);
      else _this.processor();
    });
  }

  var processor = function() {
    var _this = this;
    _this.actualPRomise = null;
    var promise = new Promise(function(_resolve, _reject) {
      //_this.signal += 0.01;
      _resolve(_this.signal);
    })
    .then(function(res){
        _this.client.write('WRITE 0 '+(res.toString())+'\n', function(){
          var pause = 100  - (Date.now() - _this.startTime);
          pause = pause > 0 ? pause : 0;
          setTimeout(function(){
            _this.read(0);
          }, pause);
          _this.startTime = Date.now();
        });
    });
  } 
  
  var _connect = function(host, port){
    var _this = this;
    _this.client = new net.Socket();
    _this.host = host;
    _this.port = port;
    console.log(host, port); 

    _this.client.connect(port, host, function(){
      
      this.connected = true;
      console.log('connected');

      _this.client.on('data', function(data) {
        if(_this.actualPromise) {
          _this.actualPromise.resolve(data.toString());
        }
      });

      setTimeout(function(){
        _this.startTime = Date.now();
        _this.read(0);
      },1000);



    });
  }

  return {
    connect: _connect,
    config: _config,
    outputs: _outputs,
    signal: 2,
    channelsToRead: 2,
    actualPromise: null,
    client: null,
    read: read,
    startTime: 0,
    connected: false,
    processor: processor,
  }
}
