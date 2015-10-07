
var program_core = function() {
  var quanser = require('./quanser'); 
  var BS = require('react-bootstrap');

  var server = new quanser();

  var Grid = BS.Grid;
  var Row = BS.Row;
  var Col = BS.Col;
  var Button = BS.Button;
  var Modal = BS.Modal;
  var Input = BS.Input;


  var App = React.createClass({
    getInitialState: function() {
      return {
        connectWindowIsVisible: false
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
          <Row>
            <Col xs={2} >
              <Button bsStyle="primary" block onClick={this.showConnectWindow}><i className="fa fa-plug"></i></Button>
              <Button block><i className="fa fa-power-off"></i></Button>
            </Col>
            <Col xs={8}>
            </Col>
          </Row>
        </section>
      )
    }
  })




  React.render(<App />, document.getElementById('content'));

}

window.addEventListener('load', program_core);
