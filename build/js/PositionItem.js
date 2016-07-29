var PositionItem = React.createClass({
  displayName: "PositionItem",

  render: function () {
    return React.createElement(
      "a",
      { className: "list-group-item", href: "#" },
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