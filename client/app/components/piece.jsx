import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';

class Piece extends Component {
  render(){
    let classNames = 'piece '+ this.props.piece.color + (this.props.piece.id === this.props.selectedPiece ? ' selected': '');
    return (
      <div
        className={classNames}
        onClick={()=> this.props.dispatch({
          type: 'SELECT_PIECE',
          id: this.props.piece.id
        })}>
        <div className="inner-piece"></div>
        <div className="crown">{this.props.piece.king ? 'K' : ''}</div>
      </div>
    )
  }
};

const mapStateToProps = (state)=>{
  return {
    selectedPiece: state.game.selectedPiece
  };
};

// const mapDispatchToProps = (dispatch)=>{

// };

export default connect(mapStateToProps)(Piece);
