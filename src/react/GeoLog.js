var MODAL = {
  NONE: 0,
  CONTEXT: 1,
  REMOVE: 2,
  UPDATE: 3
};
var POSITION_TEMPLATE = Object.assign({}, {
  id: 0,
  description: '',
  latitude: 0.0,
  longitude: 0.0,
  timestamp: 0
});

var GeoLog = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    onSubmit: React.PropTypes.func
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
      positionItems.push(
        <PositionItem
          key={position.id}
          description={position.description}
          latitude={position.latitude}
          longitude={position.longitude}
          timestamp={position.timestamp}
          onClick={this.modalOpen.bind(this, MODAL.CONTEXT, position.id)}
        />
      );
    }, this);
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

        <Modal id={MODAL.CONTEXT} label="What do you want to du?" modal={this.state.modal} name="context" onClick={this.modalClose}>
          <button className="btn btn-info btn-block" type="button" onClick={this.modalOpen.bind(this, MODAL.UPDATE, null)}>
            {this.state.position.description == '' ? 'Add' : 'Update'} description
          </button>
          <button className="btn btn-danger btn-block" type="button" onClick={this.modalOpen.bind(this, MODAL.REMOVE, null)}>Remove position</button>
          <button className="btn btn-default btn-block" type="button" onClick={this.modalClose}>Cancel</button>
        </Modal>
        <Modal id={MODAL.REMOVE} label="Remove position" modal={this.state.modal} name="remove" onClick={this.modalClose}>
          <p>Are you sure you want to remove this position?</p>
          <button className="btn btn-danger btn-block" type="button" onClick={this.removePosition}>Yes</button>
          <button className="btn btn-default btn-block" type="button" onClick={this.modalClose}>No</button>
        </Modal>
        <Modal id={MODAL.UPDATE} label="Description" modal={this.state.modal} name="update" onClick={this.modalClose}>
          <FormUpdate onChange={this.onPositionChange} onSubmit={this.onPositionUpdate} value={this.state.position} />
        </Modal>

        <div className={this.state.modal == MODAL.NONE ? 'hidden' : 'modal-backdrop fade in'} />
      </div>
    );
  },

  onPositionChange: function (position) {
    this.setState({
      position: position
    });
  },
  onPositionUpdate: function () {
    var position = Object.assign({}, this.state.position, {errors: {}});

    if (position.description.length > 50) {
      position.errors.description = ['Your description is too long.'];
    }

    if (Object.keys(position.errors).length === 0) {
      delete position.errors;
      var positions = this.state.positions;
      var index = _.findIndex(positions, ['id', position.id]);
      if (index != -1) {
        positions[index] = position;
        this.setState({
          positions: positions
        }, this.updateStorage);
        this.modalClose();
      }
    } else {
      this.setState({
        position: position
      });
    };
  },

  modalOpen: function (modal, id, event) {
    event.preventDefault();
    var position = _.find(this.state.positions, ['id', id]);
    this.setState(position !== undefined ? {
      modal: modal,
      position: position
    } : {
      modal: modal
    });
  },
  modalClose: function (event) {
    if (event) {
      event.preventDefault();
    }
    this.setState({
      modal: MODAL.NONE,
      position: Object.assign({}, POSITION_TEMPLATE)
    });
  },

  updateStorage: function () {
    localStorage.setItem('id', this.state.id);
    localStorage.setItem('positions', JSON.stringify(this.state.positions));
  },

  removePosition: function () {
    var positions = this.state.positions;
    var index = _.findIndex(positions, ['id', this.state.position.id]);
    if (index != -1) {
      positions.splice(index, 1);
      this.setState({
        positions: positions
      }, this.updateStorage);
    }
    this.modalClose();
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
