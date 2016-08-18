import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';

class Info extends Component {
  render(){
    return(
      <div className="info-container container">
        <h1>{this.props.currentTurn}s turn</h1>
        <div>Current Selected Piece: {this.props.selectedPiece}</div>
        <div>Current Selected Tile: {this.props.selectedTile}</div>
      </div>
    );
  }
}

const mapStateToProps = (state)=>{
  return {
    selectedTile: state.game.selectedTile,
    selectedPiece: state.game.selectedPiece,
    currentTurn: state.game.currentTurn
  }
};

export default connect(mapStateToProps)(Info);