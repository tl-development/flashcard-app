import React, { Component } from 'react';
import './App.css';
import Card from './card/card';
import DrawButton from './drawbutton/drawbutton';

class App extends Component {
  constructor(props){
    super(props);
    this.updateCard = this.updateCard.bind(this);
    this.randomCard = this.randomCard.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      cards: [{
        content: {
          front: 'default front',
          back: 'default back'
        }
      }],
      currentCard: 0
    }
  }

componentWillMount() {
  fetch('/card/all', {method: 'POST'})
    .then(res=>res.json())
    .then(cards=>{
      if (cards.length) { this.setState({cards, currentCard: 0}); }
    });
}

handleSubmit(e) {
  // app.post('/card/save', (req, res) => {
  //   const { name, content, isVisible, owner, tags } = req.body;
  //   Db.saveCard(req.body, function (err, data) {
  e.preventDefault();
  console.log(e);
  let nameField = document.getElementById("name");
  let frontField = document.getElementById("front");
  let backField = document.getElementById("back");
  const name=nameField.value;
  const front=frontField.value;
  const back=backField.value;
  console.log(name, front, back);
  if (name&&front&&back) {
    const payload=JSON.stringify(
      { "name":name, 
        "content": { "front":front, "back":back } });
        console.log(payload);
    fetch('/card/save', {
      method:'POST',
      body: payload,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }}
    ).then(res=>res.json())
        .then(parsed=>{
          console.log('Post response from server: ',parsed);
      });
      nameField.value='';
      frontField.value='';
      backField.value='';
  }
}
updateCard(){
  const currentCards = this.state.cards;
  this.setState({
    currentCard: this.getRandomCard(currentCards)
  })
}

randomCard() {
  const currentCard=Math.floor(Math.random()*this.state.cards.length);
  this.setState({currentCard});
}

setCard(idx) {
  this.setState({currentCard:idx});
}

  render() {
    const cardToRender=this.state.cards[this.state.currentCard];
    const listItems=this.state.cards.map((card,idx)=>
    <li key={idx}><a href="#" onClick={()=>this.setCard(idx)}>{card.name}</a></li>);
    return (
      <div className="App">
        <div className="cardRow">
          {cardToRender && <Card content={cardToRender.content} />}
        </div>
        <div className="randomCard">
          <button onClick={this.randomCard}>Random Card</button>
          Add new card:
          <form onSubmit={this.handleSubmit}>
          card name: <input id="name" type="text" /><br />
          front: <input id="front" type="text" /><br />
          back: <input id="back" type="text" /><br />
          <button id="submit">submit</button>
          </form>
          <div id="cardList">
          <ul>{listItems}</ul>
          </div>
        </div>
        <div className="buttonRow">
          <drawButton drawCard={this.updateCard}/>
        </div>
      </div>
    );
  }
}

export default App;
