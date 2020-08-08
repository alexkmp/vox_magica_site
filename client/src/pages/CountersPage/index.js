import React, { Component } from 'react';
import { connect } from 'react-redux';
import CountersList from './CountersList';

class CountersPage extends Component {
  renderCounters() {
    const { count, loading, error } = this.props.count;

    if (error) return <h5>Server not responce ...</h5>;
    /*
    if (count == null || loading) {
      return (
        <div>
          <h4>Loading..</h4>
        </div>
      );
    }*/
    if (count == null || loading) return;

    return <CountersList counts={count} />;
  }

  render() {
    return <div>{this.renderCounters()}</div>;
  }
}

function mapStateToProps(state) {
  return { count: state.counters.counter };
}
export default connect(mapStateToProps, null)(CountersPage);
