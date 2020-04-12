import React from 'react';

export default function Card({ timeRemaining }) {
    return <div data-testid='game-header'>{timeRemaining}</div>;
}