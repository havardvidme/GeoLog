var PositionItem = React.createClass({
  displayName: 'PositionItem',

  render: function () {
    var description = null;
    if (this.props.description == '') {
      description = React.createElement(
        'p',
        { className: this.props.description == '' ? 'hidden' : 'list-group-item-text' },
        React.createElement('span', { 'aria-hidden': 'true', className: 'glyphicon glyphicon-comment' }),
        ' ',
        this.props.description
      );
    }
    return React.createElement(
      'a',
      { className: 'list-group-item', href: '#' },
      React.createElement(
        'p',
        { className: 'list-group-item-text' },
        React.createElement('span', { 'aria-hidden': 'true', className: 'glyphicon glyphicon-map-marker' }),
        ' ',
        React.createElement(
          'strong',
          null,
          this.props.latitude,
          ', ',
          this.props.longitude
        )
      ),
      React.createElement(
        'p',
        { className: 'list-group-item-text' },
        React.createElement('span', { 'aria-hidden': 'true', className: 'glyphicon glyphicon-time' }),
        ' ',
        this.props.timestamp
      ),
      description
    );
  }
});
var POSITION_TEMPLATE = Object.assign({}, {
  id: 0,
  description: '',
  latitude: 0.0,
  longitude: 0.0,
  timestamp: 0
});

var GeoLog = React.createClass({
  displayName: 'GeoLog',

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
      positionItems.push(React.createElement(PositionItem, {
        description: position.description,
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: position.timestamp
      }));
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'page-header' },
          React.createElement(
            'h1',
            null,
            'GeoLog'
          )
        ),
        React.createElement(
          'button',
          { className: 'btn btn-lg btn-success btn-block', onClick: this.addPosition },
          'Add position'
        ),
        React.createElement('hr', null),
        React.createElement(
          'div',
          { className: 'list-group' },
          positionItems
        )
      )
    );
  },

  updateStorage: function () {
    localStorage.setItem('id', this.state.id);
    localStorage.setItem('positions', JSON.stringify(this.state.positions));
  },

  addPosition: function (event) {
    navigator.geolocation.getCurrentPosition(this.getPositionSuccess, this.getPositionError);
  },
  getPositionSuccess: function (position) {
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
  getPositionError: function (error) {
    console.log('code: %s, message: %s', error.code, error.message);
  }
});