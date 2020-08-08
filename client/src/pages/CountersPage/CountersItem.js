import React, { Component } from 'react';

class CountersItem extends Component {
  render() {
    const { count } = this.props.count;

    return <h5>{count}</h5>;
  }
}
export default CountersItem;
