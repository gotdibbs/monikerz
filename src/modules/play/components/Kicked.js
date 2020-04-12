import React from 'react';

export default function Kicked() {
    return (
        <main className='card flex-column' data-testid='Kicked'>
            <div className='card-body'>
                <p>Shoot looks like the game is going on without you!</p>
                <p className='mb-0'>
                    You may have been kicked from the game because you didn't pick a name, team, or cards fast enough or just because you were being mean.
                </p>
            </div>
        </main>
    );
}
