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