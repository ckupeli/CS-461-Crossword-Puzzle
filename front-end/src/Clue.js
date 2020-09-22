import React, { Component } from 'react';
import "./Clue.css";

class Clue extends Component {
  render() {
    return (
      <li className="Clue-Li">
        <span className="Clue-Label">
          {this.props.number}
        </span>
        <span className="Clue-Text">
          {this.props.clue}
        </span>
      </li>
    )
  }
}

export default Clue;