var POSITION_TEMPLATE = Object.assign({}, {
  id: 0,
  description: '',
  latitude: 0.0,
  longitude: 0.0,
  timestamp: 0
});

var GeoLog = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },
  getInitialState: function () {
    return {
      id: 0,
      position: POSITION_TEMPLATE,
      positions: []
    };
  },
  componentDidMount: function () {
    var id = parseInt(localStorage.getItem('id') || 0);
    var positions = JSON.parse(localStorage.getItem('positions')) || [];
    this.setState({
      id: id,
      positions: positions
    });
  },
  render: function () {
    var positionItems = [];
    _.orderBy(this.state.positions, ['timestamp'], ['desc']).forEach(function (position) {
      positionItems.push(
        <a className="list-group-item" href="#">
          {position.timestamp}
        </a>
      );
    });
    return (
      <div>
        <div className="container">
          <div className="page-header">
            <h1>GeoLog</h1>
          </div>
          <button className="btn btn-lg btn-success btn-block" onClick={this.addPosition}>Add position</button>
          <hr />
          <div className="list-group">{positionItems}</div>
        </div>
      </div>
    );
  },

  updateStorage: function () {
    localStorage.setItem('id', this.state.id);
    localStorage.setItem('positions', JSON.stringify(this.state.positions));
  },

  addPosition: function (event) {
    navigator.geolocation.getCurrentPosition(this.getPositionSuccess, this.getPositionError);
  },
  getPositionSuccess: function(position) {
    var id = this.state.id + 1;
    var position = Object.assign({}, this.state.position, {
      id: id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: position.timestamp
    });
    var positions = this.state.positions;
    positions.push(position);
    this.setState({
      id: id,
      positions: positions
    }, this.updateStorage);
  },
  getPositionError: function(error) {
    console.log('code: %s, message: %s', error.code, error.message);
  }
});
