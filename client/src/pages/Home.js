import React, { Component } from 'react';
import { connect } from 'react-redux';
import Recaptcha from 'react-recaptcha';

import { recaptchaSiteKey } from '../pages/keys/keys';

import { fetchAllCounter, addCount } from '../ducks/counters';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initial: '',
      isCaptchaVerified: '',
      token: '',
      file_type: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllCounter();
  }

  handleClick(e) {
    e.preventDefault();

    this.setState({
      initial: true
    });

    if (this.state.isCaptchaVerified) {
      console.log('addCount');
      this.props.addCount(this.state);
    }
  }

  handleChange(event) {
    this.setState({
      file_type: event.target.value
    });  
  }

  callback = () => {
    console.log('Done!!!!');
    this.setState({
      initial: true,
    });
  };

  verifyCallback = (response) => {
    console.log(response);
    this.setState({
      isCaptchaVerified: true,
      token: response
    });
  };

  expiredCallback = () => {
    console.log(`Recaptcha expired`);
  };

  render() {
    return (
      <div className="container">
        <h4>Aleksandr</h4>

        {this.state.initial && (
          <div>
            <Recaptcha
              sitekey={recaptchaSiteKey}
              render="explicit"
              verifyCallback={this.verifyCallback}
              onloadCallback={this.callback}
              expiredCallback={this.expiredCallback}
            />
          </div>
        )}

        <form className="form-inline my-1 my-lg-0">
          <div className="form-group col-12">
          <label>Выберите тип файла:
            <select name="file_type" id="file_type" onChange={this.handleChange}>
              <option value="fb2">fb2</option>
              <option value="pdf">pdf</option>
              <option value="epub">epub</option>
              <option value="docx">docx</option>
            </select>
          </label> 
          </div>
          <div className="form-group col-12">
            <button
              className="btn  btn-info my-2 my-sm-0"
              type="button"
              onClick={this.handleClick}>
              {' '}
              Скачать
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { fetchAllCounter, addCount })(Home);
