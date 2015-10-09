var BS = require('react-bootstrap');
var Level = require('zingchart-react').core;
var Button = BS.Button;

Level = React.createClass({
    
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
            <Level id="chart1" height={this.props.height||"300"} width="100%" data={myConfig} legend="true" theme="light"/>
        </div>
      )
    }
  });

Setpoint = React.createClass({
    
    componentDidMount: function() {
      this.setState({
        data: this.simulateLiveData()
      })
    },

    simulateLiveData: function(){
      var a = [];
      for(var i=0; i< 200; i++){
        a.push(0);
      } 
      return a;
    },

    getInitialState: function() {
      return {
        data: [],
        pause: false,
        type: "step",
        scale: "voltage"
      }
    },

    pause: function() {
      this.state.pause = (!!(~~this.state.pause^1));
    },

    render: function() {
      var myConfig = {
        type: "area",
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
      }

      return (
        <div>
          <Button bsStyle="warning" onClick={this.pause} block><i className="fa fa-pause"></i></Button>
            <ZingChart id="chart1" height={this.props.height||"300"} width="100%" data={myConfig} legend="true" theme="light"/>
        </div>
      )
    }
  });

module.exports = {
  Level: Level,
  Setpoint: Setpoint
}