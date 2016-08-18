import React, {Component, PropTypes} from "react";
import Tile from './tile';
import Piece from './piece';
import {connect} from 'react-redux';

class Board extends Component{

  render(){

    return (
      <div className="board-container">
        {this.props.board.map((row, i) => {
            return (
              <div key={i} className="board-row">
                {row.map((tile, j)=>{
                  return (
                    <div key={tile.id} style={{display: 'inline-block'}}>
                      {this.props.pieces[tile.id] ? <Piece key={this.props.pieces[tile.id]} piece={this.props.pieces[tile.id]} /> : ''}
                      <Tile tile={tile} />
                    </div>
                  );
                })}
              </div>
            );
          })
        }
      </div>
    );

  }
}


Board.propTypes = {
  board: PropTypes.array.isRequired,
  pieces: PropTypes.object.isRequired
}

function mapStateToProps(state){
  return {
    board: state.game.board,
    pieces: state.game.pieces,
  };
}

// function mapDispatchToProps(dispatch){
//   return {}
// }

export default connect(mapStateToProps)(Board);

