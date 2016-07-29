var Modal = React.createClass({
  propTypes: {
    id: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    modal: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func
  },
  render: function () {
    var closeButton = !this.props.onClick ? null : (
      <button aria-label="Close" className="close" onClick={this.props.onClick} type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    );
    var labelId = 'modal-' + this.props.name + '-label';
    return (
      <div aria-labelledby={labelId} className="modal fade in" id={'modal-' + this.props.name} role="dialog" style={{display: this.props.id == this.props.modal ? 'block' : 'none'}} tabIndex="-1">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {closeButton}
              <strong id={labelId}>{this.props.label}</strong>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
