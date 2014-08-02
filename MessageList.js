/** @jsx React.DOM */

var HTMLSandbox = require('./HTMLSandbox');
var React = require('react/addons');
var _ = require('lodash');

var PureRenderMixin = React.addons.PureRenderMixin;
var PropTypes = React.PropTypes;
var cx = React.addons.classSet;

var MessageList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    messages: PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      expandedIndex: null
    };
  },

  _onMessageClick(index) {
    if (this.state.expandedIndex === index) {
      index = null;
    }

    this.setState({
      expandedIndex: index
    });
  },

  render() {
    var items = this.props.messages.map((msg, index) => (
      <MessageListItem
        message={msg}
        index={index}
        isExpanded={this.state.expandedIndex === index}
        onClick={this._onMessageClick}
      />
    ));
    return (
      <ul className="MessageList">
        <li
          className={cx(
            'MessageList_item',
            'MessageList_item-header'
          )}
          key="header">
          <div className="MessageList_item_target">
            <div className="MessageList_item_sender">
              From
            </div>
            <div className="MessageList_item_subject">
              Subject
            </div>
          </div>
        </li>
        {items}
      </ul>
    );
  }
});

var MessageListItem = React.createClass({
  propTypes: {
    index: React.PropTypes.number.isRequired,
    isExpanded: React.PropTypes.bool.isRequired,
    message: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },

  _onClick() {
    this.props.onClick(this.props.index, this.props.message);
  },

  render() {
    var msg = this.props.message;
    var body = msg.body['text/html'] ||
      '<div style="white-space:pre">' +
        _.escape(msg.body['text/plain']) +
      '</div>';

    var isExpanded = this.props.isExpanded;
    return (
      <li
        className={cx({
          'MessageList_item': true,
          'MessageList_item-expanded': isExpanded
        })}
        key={msg.id}>
        <div
          className="MessageList_item_target"
          onClick={this._onClick}>
          <div className="MessageList_item_sender">
            {msg.from.name}
          </div>
          <div className="MessageList_item_subject">
            {msg.subject}
          </div>
        </div>
        {
          isExpanded ? (
            <div className="MessageList_item_content">
              <HTMLSandbox
                html={body}
                iframeBodyStyle={{
                  'font-family': window.getComputedStyle(document.body).fontFamily
                }}
              />
            </div>
          ) : null
        }
      </li>
    );
  }
});

module.exports = MessageList;
