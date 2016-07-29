var MODAL = {
  NONE: 0,
  CONTEXT: 1
};
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
    onClick: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      modal: MODAL.NONE,
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
        key: position.id,
        description: position.description,
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: position.timestamp,
        onClick: this.modalOpen.bind(this, MODAL.CONTEXT, position.id)
      }));
    }, this);
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
      ),
      React.createElement(
        Modal,
        { id: MODAL.CONTEXT, label: 'What do you want to du?', modal: this.state.modal, name: 'context', onClick: this.modalClose },
        React.createElement(
          'p',
          null,
          'Context modal goes here'
        )
      ),
      React.createElement('div', { className: this.state.modal == MODAL.NONE ? 'hidden' : 'modal-backdrop fade in' })
    );
  },

  modalOpen: function (modal, id, event) {
    event.preventDefault();
    var position = _.find(this.state.positions, ['id', id]);
    if (position !== undefined) {
      console.log(position);
    }
    this.setState({
      modal: modal
    });
  },
  modalClose: function (event) {
    event.preventDefault();
    this.setState({
      modal: MODAL.NONE
    });
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