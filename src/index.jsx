
var program_core = function() {

  var React = require('react');
  var quanser = require('./quanser'); 
  var BS = require('react-bootstrap');
  //var LineChart = require("react-chartjs").Line;
  var ZingChart = require('zingchart-react').core;
  var server = new quanser();

  var Grid = BS.Grid;
  var Row = BS.Row;
  var Col = BS.Col;
  var Button = BS.Button;
  var Modal = BS.Modal;
  var Input = BS.Input;

  //var LineChart = ZingChart.line;

  var Plot = React.createClass({
    
    componentDidMount: function() {
      setInterval(this.changeData, 100);
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
          aspect: "spline",
          marker: {
            visible: true
          },
          hoverState: {},
          tooltip: {
            visible: true
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
          guide: {
            visible: false
          },
          lineColor: "#333",
          tick: {
            lineColor: "#333"
          },
          item: {
            fontColor: "#333"
          },
          refLine: {
            lineColor: "#333"
          }
        },
      }

      return (
        <div>
            <Button bsStyle="warning" onClick={this.pause} block><i className="fa fa-pause"></i></Button>
        <ZingChart id="chart1" height="300" width="100%" data={myConfig} legend="true" theme="light" title="Hello Line Chart"/>
        </div>
      )
    }
  });

  var App = React.createClass({
    getInitialState: function() {
      return {
        connectWindowIsVisible: false,
        plotTime: 0,
        /*chartData: {
          labels:[0],
          datasets:[
            {
              data: [0]
            }
          ]
        }*/
        plot: [{text:"Data1", values:[4,3,2]}]
      }
    },
    showConnectWindow: function() {
      this.setState({
        connectWindowIsVisible: true
      })
    },
    closeConnectWindow: function() {
      this.setState({
        connectWindowIsVisible: false
      })
    }, 

    connect: function() {
      var ip = this.refs.connectHost.getValue();
      var port = this.refs.connectPort.getValue();
      server.connect(ip, +port);
      this.closeConnectWindow();
    },
  
    test: function() {
      console.log("add");
      this.state.plotTime += 1;
      this.state.plot[0].values.push(this.state.plotTime);
      this.setState({plot: this.state.plot});
      
    },


    render: function() {
      return (
        <section>
            <Modal show={this.state.connectWindowIsVisible} onHide={this.closeConnectWindow}>
              <Modal.Header>
                <Modal.Title>Modal title</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Input 
                  type="text"
                  placeholder="Enter host"
                  label="Host IP"
                  ref="connectHost"
                />
                <Input 
                  type="number"
                  value="20081"
                  placeholder="Enter port"
                  label="Host Port"
                  ref="connectPort"
                /> 
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={this.closeConnectWindow}>Close</Button>
                <Button bsStyle="primary" onClick={this.connect}>Connect</Button>
              </Modal.Footer>

            </Modal>
          <Row>
            <Col xs={2} >
              <Button bsStyle="success" block onClick={this.showConnectWindow}><i className="fa fa-plug"></i></Button>
              <Button block onClick={this.test}><i className="fa fa-power-off"></i></Button>
            </Col>
            <Col xs={8}>
              <Plot sensors={server.outputs.sensors} />
            </Col>
          </Row>
        </section>
      )
    }
  })




  React.render(<App />, document.getElementById('content'));

}

window.addEventListener('load', program_core);
