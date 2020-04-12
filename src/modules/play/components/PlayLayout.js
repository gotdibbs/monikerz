import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { Redirect, useParams } from 'react-router-dom';

import { getGameMetadata } from 'data/selectors';
import CenterCard from 'common/components/CenterCard';
import Page from 'common/components/Page';
import GameManager from './GameManager';

export default function PlayLayout() {
    const { gameId, clientId } = useParams();

    useFirestoreConnect([
        {
            collection: 'games',
            where: [
                ['gameId', '==', gameId ]
            ],
            limit: 1
        },
        {
            collection: 'clients',
            where: [
                ['gameId', '==', gameId]
            ]
        }
    ]);

    const gameState = useSelector(state => getGameMetadata(state, clientId));
    const isLoading = !isLoaded(gameState);

    // Check for if firestore is loading or has stale data from a previous game
    if (isLoading) {
        return (
            <Page title='Loading...' isLoading='true' />
        );
    }

    if (!gameState.gameId || gameId !== gameState.gameId) {
        return (
            <CenterCard>
                <div className='card'>
                    <div className='card-header bg-warning fade-in'>
                        Game Not Found!
                    </div>
                </div>
            </CenterCard>
        );
    }

    if (gameState.status === 'complete') {
        return <Redirect to={`/gameover/${gameState.id}/${gameState.bluePoints}/${gameState.redPoints}`} />;
    }

    const machineState = gameState?.me?.state ? JSON.parse(gameState.me.state) : null;

    return (
        <GameManager gameState={gameState} machineState={machineState} />
    );
}