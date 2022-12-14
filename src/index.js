import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  function Square(props) {
    return (
      <button className={`square ${props.highlight ? "bold" : ""} ${props.currentLoc ? "current" : ""}`} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  function CalculateWinner(squares){
    const winLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for(let i=0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          name: squares[a],
          line: [a, b, c]
        }
      }
    }
    return null;
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      let found = this.props.winnerLine.filter( x => {
        return x === i
      })
      return <Square 
        value={this.props.squares[i]}
        index={i}
        currentLoc={this.props.squares[i] && this.props.currentLoc === i}
        onClick={() => this.props.onClick(i)}
        highlight={ found.length > 0}
        />;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        currentLoc: -1,
        xIsNext: true,
      }
    }
    

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const winner = CalculateWinner(squares);
      if( winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        currentLoc: i,
        xIsNext: !this.state.xIsNext,
      })
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = CalculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const desc = move ? 'Goto move #' + move : 'Go to start game';
        return(
          <li>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      })

      let status;
      let winnerLine = [];
      let vacant = current.squares.filter(m => {
        return m === null
      });
      if(winner) {
        status = 'Winner: ' + winner.name;
        winnerLine = winner.line;
      }
      else if(vacant.length === 0) {
        status = 'Draw'
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              currentLoc={this.state.currentLoc}
              winnerLine={winnerLine}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  