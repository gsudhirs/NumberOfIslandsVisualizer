import React, {Component} from 'react';
import Node from './Node/Node';

import './numisland.css'

const START_NODE_ROW = 0;
const START_NODE_COL = 0;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 49;
const GRID_ROWS = 20;
const GRID_COLS = 50;

/**
 * This class visualizes the Number of Islands LeetCode problem
 * @author Gahan Sudhir
 */
export default class numisland extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],                       // grid of cells that represents islands & water
            visited: [],                    // 2D array representing whether search reached cell at i,j
            mouseIsPressed: false,          
            islands: 0,                     // current # of islands detected
            orderVisited: [],               // order of cells visited by search
        };
        this.dfs=this.dfs.bind(this);
    }

    componentDidMount() {
        const grid = getInitGrid();
        const visited = getInitVisited();
        this.setState({grid, visited});
    }

    /**
     * toggle isIsland for cell at r,c
     * @param {*} row 
     * @param {*} col 
     */
    handleMouseDown(row, col) {
        const newGrid = getNewGridWithIsland(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }
    
    /**
     * toggle isIsland for cell at r,c
     * @param {*} row 
     * @param {*} col 
     * @returns 
     */
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithIsland(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }
    
    /**
     * set mouse to not pressed
     */
    handleMouseUp() {
        this.setState({mouseIsPressed: false});
    }

    /**
     * animates path taken by the algorithm and discerns islands vs water
     */
    animate() {
        var orderVisited = this.state.orderVisited;
        var islands = this.state.islands;
        var newIsland = false;
        for (let i = 0; i < orderVisited.length; i++) {
            setTimeout(() => {
                const node = orderVisited[i];
                const {isIsland} = node;
                if (isIsland) {
                    if (!newIsland) {
                        islands++;
                        newIsland = true;
                        this.setState({islands: islands});
                    }
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node island-visited';
                }
                else {
                    newIsland = false;
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                  'node node-visited';
                }
            }, 10 * i);
        }
    }

    /**
     * explores the grid and DFS on the first unvisited cell thats an island
     */
    visualizeDFS() {
        var grid = this.state.grid;
        var visited = this.state.visited;
        var orderVisited = this.state.orderVisited;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const {isIsland} = grid[r][c];
                if (isIsland && !visited[r][c]) {
                    this.dfs(r, c);
                }
                else {
                    if (visited[r][c])
                        continue;
                    orderVisited.push(grid[r][c]);
                    this.setState({orderVisited: orderVisited});
                }
            }
        }
        this.animate();
    }

    /**
     * helper method to dfs and detect a single island
     * @param {*} row 
     * @param {*} col 
     * @returns 
     */
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

    /**
    * explores the grid and BFS on the first unvisited cell thats an island
    */
    visualizeBFS() {
        var grid = this.state.grid;
        var visited = this.state.visited;
        var orderVisited = this.state.orderVisited;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const {isIsland} = grid[r][c];
                if (isIsland && !visited[r][c]) {
                    this.bfs([[r, c]]);
                }
                else {
                    if (visited[r][c])
                        continue;
                    orderVisited.push(grid[r][c]);
                    this.setState({orderVisited: orderVisited});
                }
            }
        }
        this.animate();
    }

    /**
     * helper method to bfs and detect a single island
     * @param {*} row 
     * @param {*} col 
     * @returns 
     */
    bfs(queue){
        var grid = this.state.grid;
        var visited = this.state.visited;
        var orderVisited = this.state.orderVisited;
        const DIRECTIONS = [[-1,0],[0,1],[1,0],[0,-1]];
        while (queue.length > 0) {
            let [row, col] = queue.shift();
            if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS || visited[row][col])
                continue;
            const {isIsland} = grid[row][col];
            if (!isIsland)
                continue;
            visited[row][col] = true;
            orderVisited.push(grid[row][col]);
            this.setState({orderVisited: orderVisited});
            for (let dir of DIRECTIONS) {
                queue.push([row+dir[0], col+dir[1]]);
            }
        }
    }

    /**
     * clears all islands on the board
     */
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
            islands: 0,
        })
    }

    render() {
        const {grid, mouseIsPressed, islands} = this.state;
        return (
            <div>
                <button onClick={() => this.visualizeDFS()}>
                    Visualize DFS
                </button>
                <button onClick={() => this.visualizeBFS()}>
                    Visualize BFS
                </button>
                <button onClick={() => this.clearBoard()}>
                    Clear grid
                </button>
                <label>
                    Number of islands: {islands}
                </label>
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

/**
 * returns new grid of tuples w info of cell
 * @returns grid
 */
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

/**
 * returns visited bool array to inform whether cell at i,j is visited
 * @returns 2d boolean visited arr
 */
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

/**
 * creates a tuple of Node info
 * @param {*} row 
 * @param {*} col 
 * @returns 
 */
const createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isIsland: false,
    };
};

/**
 * marks a cell on the grid as an island 
 * @param {*} grid 
 * @param {*} row 
 * @param {*} col 
 * @returns 
 */
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