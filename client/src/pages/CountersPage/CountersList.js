import React, { Component } from 'react';

import CountersItem from './CountersItem';

class CountersList extends Component {
  render() {
    const { counts } = this.props;

    return (
      <div>
        {counts.map((count) => (
          <CountersItem count={count} key={`${count._id}`} />
        ))}
      </div>
    );
  }
}
export default CountersList;
