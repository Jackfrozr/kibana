/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ClickOutside extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.onClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClick);
  }

  setNodeRef = (node) => {
    this.nodeRef = node;
  };

  onClick = (event) => {
    if (this.nodeRef && !this.nodeRef.contains(event.target)) {
      this.props.onClickOutside();
    }
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { onClickOutside, ...restProps } = this.props;
    return (
      <div ref={this.setNodeRef} {...restProps}>
        {this.props.children}
      </div>
    );
  }
}

ClickOutside.propTypes = {
  onClickOutside: PropTypes.func.isRequired,
};
