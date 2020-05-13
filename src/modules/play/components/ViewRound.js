import React, { useEffect, useState } from 'react';

import Button from 'common/components/Button';
import Card from './Card';
import GameHeader from './GameHeader';

export default function ViewRound({ gameState, timeRemaining, skip }) {
    const { player } = gameState;
    const [showSkip, setShowSkip] = useState(false);

    const isMyTeamsTurn = player.team === gameState.me?.team;

    useEffect(() => {
        // Wait five seconds then show the skip button
        const timer = setTimeout(() => {
            setShowSkip(true);
        }, 5000);

        return () =>  clearTimeout(timer);
    }, []);

    return (
        <main className='card flex-column' data-testid='ViewRound'>
            <GameHeader gameState={gameState} timeRemaining={timeRemaining} />

            <div className='card-body d-flex flex-column align-items-center'>
                <p className='text-center'>
                    <b>{player.name}</b> on the {(player.team === 'blue' ?
                        <b className='text-primary'>Blue Team</b> :
                        <b className='text-danger'>Red Team</b>
                    )}
                    {isMyTeamsTurn ? (
                        <span className='text-muted'> (your team)</span>
                    ): null}
                    &nbsp;is up and giving clues.
                </p>
                {showSkip && isMyTeamsTurn && gameState.goalTime == null ? (
                    <p>
                        <Button className='btn btn-lg btn-danger w-100'
                            onClick={skip}
                            async
                            data-testid='skip-player'>Skip {player.name}</Button>
                    </p>
                ) : null}
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