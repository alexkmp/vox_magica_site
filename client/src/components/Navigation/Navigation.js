import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <div id="logo" className="pull-left">
          <h1>Заголовок</h1>
        </div>

        <div className="navbar  navbar-expand-md  navbar-dark    bg-info ">
          <a className="navbar-brand" href="/">
            Главная
          </a>
          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarsExampleDefault"
            aria-controls="navbarsExampleDefault"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon " />
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul className="navbar-nav mr-auto">
              <Link className="nav-link" to="/book">
                Домой
              </Link>
            </ul>

            <ul className="navbar-nav navbar-right ">
              <Link className="nav-link" to="/about">
                Об авторе
              </Link>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigation;
