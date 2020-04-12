import React from 'react';

export default function WaitKick({ gameState }) {
    const clients = (gameState.clients || []);
    const kickables = clients.filter(c => !c.selected_cards).map(c => c.name);

    return (
        <main className='card flex-column' data-testid='WaitKick'>
            <div className='card-body'>
                <span className='ellipsis'>Waiting for {kickables.join(', ')} to finish their selections</span>
            </div>
        </main>
    );
}