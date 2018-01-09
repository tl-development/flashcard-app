import React, { Component } from 'react';
import './card.css';

const Card = (props) => (
    <div className="card-container">
        <div className="card">
            <div className="front">
                <div className="q">{props.content.front}</div>
            </div>
            <div className="back">
                <div className="a">{props.content.back}</div>
            </div>
        </div>
    </div>
)

export default Card
