import React from 'react';

import Button from 'common/components/Button';
import Card from './Card';
import GameHeader from './GameHeader';

export default function PlayRound({
    card,
    cardIndex,
    gameState,
    timeRemaining,
    cycle,
    correct
}) {
    return (
        <main className='card flex-column' data-testid='PlayRound'>
            <GameHeader gameState={gameState}
                timeRemaining={timeRemaining} />

            <div className='card-body d-flex flex-column align-items-center'>
                <Card hints={{
                    topRight: `${cardIndex + 1} / ${gameState.cardPile.length}`
                }}
                cardIndex={card || 0} />
            </div>

            <div className='card-footer text-center'>
                <Button className='btn btn-lg btn-danger mr-4 w-45' onClick={cycle}>Skip</Button>
                <Button className='btn btn-lg btn-success w-45'
                    onClick={correct}
                    async
                    persist={gameState.cardPile.length > 1}
                    data-testid='got-it'>Got it!</Button>
            </div>
        </main>
    );
}