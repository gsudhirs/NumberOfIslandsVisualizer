import React, {Component} from 'react';
import Node from './Node/Node';

import './numisland.css'

const START_NODE_ROW = 0;
const START_NODE_COL = 0;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 49;
const GRID_ROWS = 20;
const GRID_COLS = 50;

export default class numisland extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            islands: 0,
        };
    }

    componentDidMount() {
        const grid = getInitGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithIsland(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithIsland(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }
    
    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    visualizeIslands() {
    }
    
    render() {
        const {grid, mouseIsPressed} = this.state;
        return (
            <div>
                <button onClick={() => this.visualizeIslands()}>
                    Start!
                </button>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                            const {row, col, isStart, isFinish, isIsland} = node;
                            return (
                                <Node
                                key={nodeIdx}
                                row={row}
                                col={col}
                                isStart={isStart}
                                isFinish={isFinish}
                                isIsland={isIsland}
                                mouseIsPressed={mouseIsPressed}
                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                onMouseUp = {() => this.handleMouseUp()}
                                ></Node>
                            );
                            })}
                        </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const getInitGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isIsland: false,
    };
  };

  const getNewGridWithIsland = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isIsland: !node.isIsland,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
