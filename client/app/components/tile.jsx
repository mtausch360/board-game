import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';


class Tile extends Component{
  render(){

    var classNames = ['tile',
      this.props.tile.color, this.props.tile.id === this.props.selectedTile ? 'selected': '',
      this.props.availableMoves[this.props.tile.id] ? 'move' : ''].join(' ');

    return (
      <div className={classNames}
        onClick={()=>this.props.dispatch({
          type: "SELECT_TILE",
          id: this.props.tile.id
        })}>
      </div>
    );
  }
}

Tile.propTypes = {
  selectedTile: PropTypes.string.isRequired,
  availableMoves: PropTypes.object.isRequired
};

const mapStateToProps = (state)=>{
  return {
    selectedTile: state.game.selectedTile,
    availableMoves: state.game.availableMoves
  };
}

export default connect(mapStateToProps)(Tile)