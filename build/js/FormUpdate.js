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