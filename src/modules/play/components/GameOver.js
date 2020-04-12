import React from 'react';

export default function GameOver() {
    return (
        <main className='card flex-column' data-testid='GameOver'>
            <div className='card-body'>
                <span className='ellipsis'>Game over! Wrapping things up</span>
            </div>
        </main>
    );
}