import React from 'react';

import Button from 'common/components/Button';
import GameHeader from './GameHeader';

export default function StartRound({ gameState, timeRemaining, startTurn }) {
    return (
        <main className='card flex-column' data-testid='StartRound'>
            <GameHeader gameState={gameState}
                timeRemaining={timeRemaining} />

            <div className='card-body'>
                <p>
                    It's your turn! Tap <b>Start</b> when you're ready to give clues to your team!
                </p>
                <p>
                    Team members:&nbsp; 
                    <b>{gameState.teammates.filter(c => !!c.name).map(c => c.name).join(', ')}</b>
                </p>
                <p>
                    <b>{(!gameState.round ?
                        'Describe the name using any words, sounds, or gestures except the name itself.' :
                        gameState.round === 1 ?
                            'Describe the name using only one word, which can be anything except the name itself.' :
                            'Describe the name using just charades. No words. Sound effects are OK.'
                    )}</b>
                </p>
                <p>You'll have 60 seconds once you tap <b>Start</b>.</p>
            </div>

            <div className='card-footer text-center'>
                <Button className='btn btn-lg btn-success w-100'
                    onClick={startTurn}
                    async
                    data-testid='round-start'>Start</Button>
            </div>
        </main>
    );
}