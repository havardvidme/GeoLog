var FormUpdate = React.createClass({
  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },
  render: function () {
    var errors = this.props.value.errors || {};
    return (
      <form onSubmit={this.onSubmit}>
        <div className={errors.description ? 'form-group has-error' : 'form-group'}>
          <label className="control-label" htmlFor="description">Description</label>
          <input aria-describedby="description-error" className="form-control" id="description" onChange={this.onDescriptionChange} placeholder="Description" value={this.props.value.description} type="text" />
          <span className="help-block" id="description-error">{errors.description ? errors.description : ''}</span>
        </div>
        <button className="btn btn-default" type="submit">Save</button>
      </form>
    );
  },
  onDescriptionChange: function (e) {
    this.props.onChange(Object.assign({}, this.props.value, {description: e.target.value}));
  },
  onSubmit: function(event) {
    event.preventDefault();
    this.props.onSubmit();
  }
});
