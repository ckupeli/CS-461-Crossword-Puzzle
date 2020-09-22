import React, { Component } from 'react';
import "./Cell.css";

class Cell extends Component {
  render() {
    return (
      <g>
        {
          this.props.type === 'block' &&
          <rect role="cell" className={"Cell-Block"} x={(this.props.index % 5) * 100 + 3} y={~~(this.props.index / 5) * 100 + 3} width="100.00" height="100.00"></rect>
        }
        {
          this.props.type === 'regular' &&
          <rect role="cell"  className={"Cell-Cell"} x={(this.props.index % 5) * 100 + 3} y={~~(this.props.index / 5) * 100 + 3} width="100.00" height="100.00"></rect>
        }
        {
          this.props.textAnchorStart &&
          <text x={(this.props.index % 5) * 100 + 5} y={~~(this.props.index / 5) * 100 + 36.83} textAnchor="start" fontSize="33.33">{this.props.textAnchorStart}</text>
        }
        {
          this.props.textAnchorMiddle &&
          <text x={(this.props.index % 5) * 100 + 53} y={~~(this.props.index / 5) * 100 + 94.67} textAnchor="middle" fontSize="66.67">{this.props.textAnchorMiddle}</text>
        }
      </g>
    )
  }
}

export default Cell;