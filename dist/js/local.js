var FormUpdate = React.createClass({
  displayName: 'FormUpdate',

  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },
  render: function () {
    var errors = this.props.value.errors || {};
    return React.createElement(
      'form',
      { onSubmit: this.onSubmit },
      React.createElement(
        'div',
        { className: errors.description ? 'form-group has-error' : 'form-group' },
        React.createElement(
          'label',
          { className: 'control-label', htmlFor: 'description' },
          'Description'
        ),
        React.createElement('input', { 'aria-describedby': 'description-error', className: 'form-control', id: 'description', onChange: this.onDescriptionChange, placeholder: 'Description', value: this.props.value.description, type: 'text' }),
        React.createElement(
          'span',
          { className: 'help-block', id: 'description-error' },
          errors.description ? errors.description : ''
        )
      ),
      React.createElement(
        'button',
        { className: 'btn btn-default', type: 'submit' },
        'Save'
      )
    );
  },
  onDescriptionChange: function (e) {
    this.props.onChange(Object.assign({}, this.props.value, { description: e.target.value }));
  },
  onSubmit: function (event) {
    event.preventDefault();
    this.props.onSubmit();
  }
});
var Modal = React.createClass({
  displayName: "Modal",

  propTypes: {
    id: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    modal: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func
  },
  render: function () {
    var closeButton = !this.props.onClick ? null : React.createElement(
      "button",
      { "aria-label": "Close", className: "close", onClick: this.props.onClick, type: "button" },
      React.createElement(
        "span",
        { "aria-hidden": "true" },
        "×"
      )
    );
    var labelId = 'modal-' + this.props.name + '-label';
    return React.createElement(
      "div",
      { "aria-labelledby": labelId, className: "modal fade in", id: 'modal-' + this.props.name, role: "dialog", style: { display: this.props.id == this.props.modal ? 'block' : 'none' }, tabIndex: "-1" },
      React.createElement(
        "div",
        { className: "modal-dialog modal-sm", role: "document" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "div",
            { className: "modal-header" },
            closeButton,
            React.createElement(
              "strong",
              { id: labelId },
              this.props.label
            )
          ),
          React.createElement(
            "div",
            { className: "modal-body" },
            this.props.children
          )
        )
      )
    );
  }
});
var PositionItem = React.createClass({
  displayName: "PositionItem",

  render: function () {
    return React.createElement(
      "a",
      { className: "list-group-item", href: "#", onClick: this.props.onClick },
      React.createElement(
        "p",
        { className: "list-group-item-text" },
        React.createElement("span", { "aria-hidden": "true", className: "glyphicon glyphicon-map-marker" }),
        ' ',
        React.createElement(
          "strong",
          null,
          this.props.latitude,
          ', ',
          this.props.longitude
        )
      ),
      React.createElement(
        "p",
        { className: "list-group-item-text" },
        React.createElement("span", { "aria-hidden": "true", className: "glyphicon glyphicon-time" }),
        ' ',
        this.props.timestamp
      ),
      React.createElement(
        "p",
        { className: this.props.description == '' ? 'hidden' : 'list-group-item-text' },
        React.createElement("span", { "aria-hidden": "true", className: "glyphicon glyphicon-comment" }),
        ' ',
        this.props.description
      )
    );
  }
});
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
  displayName: 'GeoLog',

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
          'button',
          { className: 'btn btn-info btn-block', type: 'button', onClick: this.modalOpen.bind(this, MODAL.UPDATE, null) },
          this.state.position.description == '' ? 'Add' : 'Update',
          ' description'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-danger btn-block', type: 'button', onClick: this.modalOpen.bind(this, MODAL.REMOVE, null) },
          'Remove position'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-default btn-block', type: 'button', onClick: this.modalClose },
          'Cancel'
        )
      ),
      React.createElement(
        Modal,
        { id: MODAL.REMOVE, label: 'Remove position', modal: this.state.modal, name: 'remoe', onClick: this.modalClose },
        React.createElement(
          'p',
          null,
          'Are you sure you want to remove this position?'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-danger btn-block', type: 'button', onClick: this.removePosition },
          'Yes'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-default btn-block', type: 'button', onClick: this.modalClose },
          'No'
        )
      ),
      React.createElement(
        Modal,
        { id: MODAL.UPDATE, label: 'Description', modal: this.state.modal, name: 'update', onClick: this.modalClose },
        React.createElement(FormUpdate, { onChange: this.onPositionChange, onSubmit: this.onPositionUpdate, value: this.state.position })
      ),
      React.createElement('div', { className: this.state.modal == MODAL.NONE ? 'hidden' : 'modal-backdrop fade in' })
    );
  },

  onPositionChange: function (position) {
    this.setState({
      position: position
    });
  },
  onPositionUpdate: function () {
    var position = Object.assign({}, this.state.position, { errors: {} });

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