import React, {Component, PropTypes} from "react"
import {connect} from 'react-redux'
import classnames from 'classnames'

class Tile extends Component{
  render () {

    const { tile, selectedTile, availableMoves } = this.props;

    return (
      <div 
        className={ classnames('tile', tile.color, { selected: tile.id === selectedTile, move: availableMoves[tile.id] }  )}
        onClick={()=>this.props.dispatch({
          type: "SELECT_TILE",
          id: this.props.tile.id
        })}>
      </div>
    )
  }
}

Tile.propTypes = {
  selectedTile: PropTypes.string.isRequired,
  availableMoves: PropTypes.object.isRequired
}

const mapStateToProps = (state)=>{
  return {
    selectedTile: state.game.selectedTile,
    availableMoves: state.game.availableMoves
  }
}

export default connect(mapStateToProps)(Tile)