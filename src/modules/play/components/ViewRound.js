import React from 'react';

import Card from './Card';
import GameHeader from './GameHeader';

export default function ViewRound({ gameState, timeRemaining }) {
    const { player } = gameState;

    return (
        <main className='card flex-column' data-testid='ViewRound'>
            <GameHeader gameState={gameState} timeRemaining={timeRemaining} />

            <div className='card-body d-flex flex-column align-items-center'>
                <p className='text-center'>
                    <b>{player.name}</b> on the {(player.team === 'blue' ?
                        <b className='text-primary'>Blue Team</b> :
                        <b className='text-danger'>Red Team</b>
                    )}
                    {player.team === gameState.me?.team ? (
                        <span className='text-muted'> (your team)</span>
                    ): null}
                    &nbsp;is up and giving clues.
                </p>
                <p className={gameState.lastCard == null ? 'mb-0 text-center' : 'text-center'}>
                    This round's clues can {(!gameState.round ? 
                        'describe the name of the card using any words, sounds, or gestures except the name itself.' : 
                        gameState.round === 1 ?
                            'describe the name using only one word, which can be anything except the name itself.' :
                            'describe the name using just charades. No words. Sound effects are OK.'
                    )}
                </p>

                { gameState.lastCard != null ? (
                    <Card cardIndex={gameState.lastCard} />
                ) : null}
            </div>
        </main>
    );
}