import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    
   
      return (
        <button 
            className="square" 
            onClick={() => props.onClick()}>
          {props.value}
        </button>
      );
 
  }
  
class Board extends React.Component {
     
    
    renderSquare(i) {
      return <Square 
      value={this.props.squares[i]}
      onClick={()=> this.props.onClick(i)}
      />;
    }

    renderThreeSquares(i){
      const row = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ];
      let squares = [];
      let squarePos = row[i];
      for (let j = 0; j < 3; j++){
        squares.push(this.renderSquare(squarePos[j]));
      }
      return squares;
       
  
    }
    render(){
      let rows = [0, 1, 2];
      let board = rows.map((rowNum) => {
        return (
        <div className="board-row" key={rowNum}>
            {this.renderThreeSquares(rowNum)}
        </div>
        )
        });
      return (
        <div>{board}</div>
        
      )
    }
    }
   
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {squares: Array(9).fill(null)}
            ],
            locationHistory: [
              {location: null}
            ],
            xIsNext: true,
            stepNumber: 0
        }
    }
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const location = this.state.locationHistory.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
  
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
       
        this.setState({
            history: history.concat([{squares: squares}]),
            locationHistory: location.concat([{location: i}]),
             xIsNext: !this.state.xIsNext,
            stepNumber: history.length
            
            });

    }

    jumpTo(step){
      this.setState({
        // Added to update history if game restarted.
        history: step === 0 ?  
          [{squares: Array(9).fill(null)} ]: this.state.history,
        locationHistory: step === 0 ?
          [{location: null}] : this.state.locationHistory,
        stepNumber: step,
        xIsNext: (step % 2) === 0
      })
    }

    render() {
        const stepNumber = this.state.stepNumber;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const location = this.state.locationHistory;
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
          let desc = move ? `Go to move #${move}` : "Go to game start";
          desc = stepNumber === move ? <b>{desc}</b> : desc;
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>
                {desc}
              </button>
              <p>location: {location[move].location}</p>
            </li>
          )
        });
      
       

        let status = winner ? `Winner: ${winner}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      return (
        <div className="game">
          <div className="game-board">
              <Board 
              squares={current.squares}
              onClick={(i)=> this.handleClick(i)}
              />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  