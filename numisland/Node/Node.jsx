import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
        row,
        col,
        isStart,
        isFinish,
        isIsland,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      :isIsland
      ? 'node-island'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}
