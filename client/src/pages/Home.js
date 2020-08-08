import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCounter, addCount } from '../ducks/counters';

class Home extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.props.fetchAllCounter();
  }

  handleClick(e) {
    console.log('DOWN');
    this.props.addCount();
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <h4>Aleksandr</h4>
        <form className="form-inline my-1 my-lg-0">
          <button
            className="btn  btn-info my-2 my-sm-0"
            type="button"
            onClick={this.handleClick}
          >
            {' '}
            Скачать
          </button>
          <div class="g-recaptcha" data-sitekey="6LfM7bkZAAAAAKn0HuY5mQGCpItIfi3Lk2uWdJPH"></div>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchAllCounter, addCount })(Home);
