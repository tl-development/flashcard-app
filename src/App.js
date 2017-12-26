import React, { Component } from 'react';
import './App.css';
import Card from './card/card';
import DrawButton from './drawbutton/drawbutton';

class App extends Component {
  constructor(props){
    super(props);

    this.updateCard = this.updateCard.bind(this);

    this.state = {
      cards: [],
      currentCard: {}
    }
  }

updateCard(){
  const currentCards = this.state.cards;
  this.setState({
    currentCard: this.getRandomCard(currentCards)
  })
}

  render() {
    return (
      <div className="App">
        <div className="cardRow">
          <Card/>
        </div>
        <div className="buttonRow">
          <drawButton drawCard={this.updateCard}/>
        </div>
      </div>
    );
  }
}

export default App;
