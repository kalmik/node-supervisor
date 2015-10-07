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
      _this.client.write('READ '+(channel));
    })
    .then(function(res){
      //console.log('THEN READ '+channel+' '+res);
      _this.outputs[channel] = +res;
      if(channel < channelsToRead-1) _this.read(++channel);
      else _this.processor();
    });
  }

  var processor = function() {
    var _this = this;
    _this.actualPRomise = null;
    var promise = new Promise(function(_resolve, _reject) {
      _this.signal += 0.01;
      _resolve(_this.signal);
    })
    .then(function(res){
      //console.log('THEN PROCESS-------------------' + res);
      _this.client.write('WRITE 0 '+(res.toString()));
    });
  } 
  
  var _connect = function(host, port){
    var _this = this;
    _this.client = new net.Socket();
    console.log(host, port); 

    _this.client.connect(port, host, function(){
      console.log('connected');
      
      _this.client.on('data', function(data) {
        if(_this.actualPromise) {
          _this.actualPromise.resolve(data.toString());
        }
      })

      console.log(_this);

      setInterval(function(){
        _this.read(0);
      },100);

    });
  }

  return {
    connect: _connect,
    config: _config,
    outputs: _outputs,
    signal: 0,
    channelsToRead: 2,
    actualPromise: null,
    client: null,
    read: read,
    processor: processor,
  }
}
