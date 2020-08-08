import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCounter, addCount } from '../ducks/counters';
import CountersPage from './CountersPage';

class Book extends Component {
  componentDidMount() {
    this.props.fetchAllCounter();
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h4>Очень интересная книга</h4>
            </div>
            <div className="col-4">
              <h4>Кол-во скачиваний</h4>
              <CountersPage />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { fetchAllCounter, addCount })(Book);
