var PositionItem = React.createClass({
  render: function () {
    return (
      <a className="list-group-item" href="#">
        <p className="list-group-item-text">
          <span aria-hidden="true" className="glyphicon glyphicon-map-marker" />
          {' '}
          <strong>
            {this.props.latitude}
            {', '}
            {this.props.longitude}
          </strong>
        </p>
        <p className="list-group-item-text">
          <span aria-hidden="true" className="glyphicon glyphicon-time" />
          {' '}
          {this.props.timestamp}
        </p>
        <p className={this.props.description == '' ? 'hidden' : 'list-group-item-text'}>
          <span aria-hidden="true" className="glyphicon glyphicon-comment" />
          {' '}
          {this.props.description}
        </p>
      </a>
    );
  }
});
