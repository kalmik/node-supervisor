var BS = require('react-bootstrap');
var ZingChart = require('zingchart-react').core;
var Button = BS.Button;
var Row = BS.Row;
var Col = BS.Col;

var Level = React.createClass({
    
    componentDidMount: function() {
      setInterval(this.changeData, 100);
      for(var i=0; i< 1200; i++){
        this.state.tank1.push(0);
        this.state.tank2.push(0);
      }
    },

    changeData: function() {
      if(this.state.pause) return;
      this.setState({
        tank1: this.simulateLiveData('tank1', 0),
        tank2: this.simulateLiveData('tank2', 1)
      })
    },

    simulateLiveData: function(who, local){
      this.state[who].push(this.props.sensors[local]);
      if(this.state[who].length > 1200)
        this.state[who].shift();
      return this.state[who];
    },

    getInitialState: function() {
      return {
        tank1:[],
        tank2:[],
        pause: false,
      }
    },

    pause: function() {
      this.state.pause = (!!(~~this.state.pause^1));
    },

    render: function() {
      var myConfig = {
        type: "line",
        series: [
          {
            values: this.state.tank1,
            lineColor: "#1fbff3",
            shadowColor: "transparent",
            lineWidth: 2,
            text: "Tank1"
          },
          {
            values: this.state.tank2,
            lineColor: "#bf00f3",
            shadowColor: "transparent",
            lineWidth: 2,
            text: "Tank2"
          }
        ],
        plot: {
          aspect: "segmented",
          marker: {
            visible: false
          },
          hoverState: {},
          tooltip: {
            visible: false
          },
          "legend-marker":{
            "type" : "circle",
            "border-width" : 2,
            "border-color" : "white"
          },
        },
        "legend":{
          "position":"50% 100%",
          "margin":"30 3 5 3",
          "layout":"x2",
          "font-family":"arial",
          "font-size":"8px",
          "background-color":"#E6E6E6",
          "width":"435px",
          "item":{
            "marker-style":"square",
            "font-color":"#000000",
            "border-width":"0px"
          }
        },
        scaleX: {
          transform: {
            type: "date",
            all: "%h:%i:%s%A",
            guide: {
              visible: false
            },
            item: {
              visible: false
            }
          },
          minValue : Date.now() - 120*1000,
          step: 1200,
        },
      }

      return (
        <div>
          <Button bsStyle="warning" onClick={this.pause} block><i className="fa fa-pause"></i></Button>
            <ZingChart id="chart1" height={this.props.height||"300"} width="100%" data={myConfig} legend="true" theme="light"/>
        </div>
      )
    }
  });

var Setpoint = React.createClass({
    
    componentDidMount: function() {
      this.setState({
        data: this.simulateLiveData()
      })
    },

    stepG: function(){
      return this.state.ampMax;
    },

    sineG: function(t) {
      return this.state.ampMax*Math.sin((1/this.state.perMax)*(2*Math.PI*t)) + this.state.offset
    },

    sawG: function(t) {
      return (2*this.state.ampMax/this.state.perMax)*( (100*t) % (100*this.state.perMax) )/100 - this.state.ampMax + this.state.offset
    },

    squareG: function(t){
      var amp = ~~(this.state.ampMax*Math.sin((1/this.state.perMax)*(2*Math.PI*t)) > 0);
      return 2*amp*this.state.ampMax - this.state.ampMax + this.state.offset
    },

    simulateLiveData: function(){
      var a = [];
      var signal = this.stepG;
      switch(this.type) {
        case "sine":
          signal = this.sineG;
          break;
        case "saw":
          signal = this.sawG;
          break;
        case "square":
          signal = this.squareG;
          break;
      }

      for(var i=0; i< 1200; i++){
        a.push(signal(i/10));
      } 
      return a;
    },

    getInitialState: function() {
      return {
        data: [],
        pause: false,
        type: "step",
        scale: "voltage",
        ampMax: 10,
        ampMin: 0,
        perMax: 30,
        perMin: 0,
        offset: 0,
      }
    },

    pause: function() {
      this.state.pause = (!!(~~this.state.pause^1));
    },

    render: function() {
      var myConfig = {
        type: "line",
        series: [
          {
            values: this.state.data,
            lineColor: "#1fbff3",
            shadowColor: "transparent",
            lineWidth: 2,
            text: "Tank1"
          },
        ],
        plot: {
          aspect: "segmented",
          marker: {
            visible: false
          },
          hoverState: {},
          tooltip: {
            visible: false
          },
        },
        scaleX: {
          transform: {
            type: "date",
            all: "%h:%i:%s%A",
            guide: {
              visible: false
            },
            item: {
              visible: false
            }
          },
          minValue : Date.now() - 120*1000,
          step: 1200,
        },
      }

      return (
        <div>
          <Row>
            <Col xs={2}>
              <Button bsStyle="default" onClick={this.pause} block>Step</Button>
            </Col>
            <Col xs={2}>
              <Button bsStyle="default" onClick={this.pause} block>Sine</Button>
            </Col>
            <Col xs={2}>
              <Button bsStyle="default" onClick={this.pause} block>Saw</Button>
            </Col>
            <Col xs={2}>
              <Button bsStyle="default" onClick={this.pause} block>Square</Button>
            </Col>
            <Col xs={2}>
              <Button bsStyle="primary" onClick={this.pause} block>OK</Button>
            </Col>
          </Row>
          <Row>
          <ZingChart id="chart2" height={this.props.height||"300"} width="100%" data={myConfig} legend="true" theme="light"/>
          </Row>
        </div>
      )
    }
  });

module.exports = {
  Level: Level,
  Setpoint: Setpoint
}