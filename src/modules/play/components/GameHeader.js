import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export default function GameHeader({ gameState, timeRemaining}) {
    const headerClass = classNames('card-header position-relative', {
        'header-blue-team': gameState.me?.team === 'blue',
        'header-red-team': gameState.me?.team === 'red'
    });

    return (
        <div className={headerClass}>
            <h4 className='mb-0'>
                {gameState.goalTime != null ? (
                    <span>
                        <FontAwesomeIcon icon={['fas', 'clock']} className='text-muted mr-2' />
                        {timeRemaining <= 10 ? (
                            <span className='text-danger'>{timeRemaining}</span>
                        ): (
                            <span>{timeRemaining}</span>
                        )}
                    </span>
                ) : <span>Round {gameState.round + 1 || 1}</span>}
                <div className='header-points'>
                    <span className='badge badge-pill badge-primary mr-2'>{gameState.bluePoints || 0}</span>
                    <span className='text-muted mr-2'>vs.</span>
                    <span className='badge badge-pill badge-danger'>{gameState.redPoints || 0}</span>
                </div>
            </h4>
        </div>
    );
}