
var program_core = function() {
  
  var gui = require('nw.gui');
  var win = gui.Window.get();

  var React = require('react');
  var quanser = require('./quanser'); 
  var BS = require('react-bootstrap');
  var ZingChart = require('zingchart-react').core;
  var server = new quanser();

  var Grid = BS.Grid;
  var Row = BS.Row;
  var Col = BS.Col;
  var Button = BS.Button;
  var Modal = BS.Modal;
  var Input = BS.Input;
  var OverlayTrigger = BS.OverlayTrigger;
  var Tooltip = BS.Tooltip;

  var Plot = React.createClass({
    
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
    
    render: function() {
      return (
        <div>
          OI
        </div>  
      )
    }
  
  });


  var ActionButton = React.createClass({
    render: function(){
      return (
        
              <OverlayTrigger placement={this.props.placment||"right"} overlay={
              <Tooltip>{this.props.title}</Tooltip>
              }>
                <Button bsStyle={this.props.type} block onClick={this.props.onClick}><i className={this.props.icon}></i></Button>
              </OverlayTrigger>
      )
    }
  });

  var App = React.createClass({
    getInitialState: function() {
      return {
        connectWindowIsVisible: true,
        setpointWindowIsVisible: false,
        plotTime: 0,
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

    showSetpointWindow: function() {
      this.setState({
        setpointWindowIsVisible: true
      })
    },

    closeSetpointWindow: function() {
      this.setState({
        setpointWindowIsVisible: false
      })
    },

    connect: function() {
      var ip = this.refs.connectHost.getValue();
      var port = this.refs.connectPort.getValue();
      server.connect(ip, +port);
      this.closeConnectWindow();
    },
 
    close: function() {
      console.log("add");
      win.close(true);
    },

    render: function() {
      return (
        <section style={{padding: 20}}>
            <Modal show={this.state.connectWindowIsVisible} onHide={this.closeConnectWindow}>
              <Modal.Header>
                <Modal.Title>Open Connection</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Input 
                  type="text"
                  value="127.0.0.1"
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

            <Modal show={this.state.setpointWindowIsVisible} onHide={this.closeSetpointWindow}>
              <Modal.Header>
                <Modal.Title>Configure Setpoint</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Setpoint />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeSetpointWindow}>Close</Button>
                <Button bsStyle="primary">Save</Button>
              </Modal.Footer>
            </Modal>

          <Row>

            <Col xs={1} >
              <ActionButton type={server.connected?'success':'warning'} icon="fa fa-plug" title="Connect" onClick={this.showConnectWindow}/>
              <ActionButton type="primary" icon="fa fa-object-group" title="Controllers" />
              <ActionButton type="primary" icon="fa fa-line-chart" title="Setpoint" onClick={this.showSetpointWindow} />
              <ActionButton type="danger" icon="fa fa-power-off" title="Close" onClick={this.close}/>
            </Col>
            <Col xs={10}>
              <Plot sensors={server.outputs.sensors} height={400}/>
            </Col>
          </Row>
        </section>
      )
    }
  })

  React.render(<App />, document.getElementById('content'));

}

window.addEventListener('load', program_core);
