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
            visited: [],
            mouseIsPressed: false,
            islands: 0,
            orderVisited: [],
        };
        this.dfs=this.dfs.bind(this);
    }

    componentDidMount() {
        const grid = getInitGrid();
        const visited = getInitVisited();
        this.setState({grid, visited});
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

    animateDFS() {
        var orderVisited = this.state.orderVisited;
        for (let i = 0; i < orderVisited.length; i++) {
            setTimeout(() => {
                const node = orderVisited[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-visited';
            }, 10 * i);
        }
    }

    visualizeIslands() {
        var grid = this.state.grid;
        var islands = this.state.islands;
        var visited = this.state.visited;
        var orderVisited = this.state.orderVisited;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const {isIsland} = grid[r][c];
                if (isIsland && !visited[r][c]) {
                    this.dfs(r, c);
                    islands++;
                }
                else {
                    if (visited[r][c])
                        continue;
                    orderVisited.push(grid[r][c]);
                    this.setState({orderVisited: orderVisited});
                }
            }
        }
        console.log(islands);
        console.log(orderVisited);
        this.animateDFS();
    }

    dfs(row, col){
        var grid = this.state.grid;
        var visited = this.state.visited;
        var orderVisited = this.state.orderVisited;
        if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS ) {
            return;
        }
        const {isIsland} = grid[row][col];
        if (!isIsland || visited[row][col])
            return;
        visited[row][col] = true;
        orderVisited.push(grid[row][col]);
        this.setState({orderVisited: orderVisited});
        this.dfs(row-1, col);
        this.dfs(row+1, col);
        this.dfs(row, col-1);
        this.dfs(row, col+1);
    }

    clearBoard() {
        var orderVisited = this.state.orderVisited;
        for (let i = 0; i < orderVisited.length; i++) {
            const node = orderVisited[i];
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node';
        }
        this.setState({
            grid: getInitGrid(),
            visited: getInitVisited(),
            orderVisited: [],
        })
    }

    render() {
        const {grid, mouseIsPressed} = this.state;
        return (
            <div>
                <button onClick={() => this.visualizeIslands()}>
                    Start!
                </button>
                <button onClick={() => this.clearBoard()}>
                    Clear grid!
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

const getInitVisited = () => {
    const grid = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push(false);
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