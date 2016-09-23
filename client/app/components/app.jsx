import React, {Component} from "react"
import Board from './board'
import Info from './info'

export default class App extends Component{
  render(){
    return (
      <div>
        <Info />
        <Board />
      </div>
    )
  }
}

