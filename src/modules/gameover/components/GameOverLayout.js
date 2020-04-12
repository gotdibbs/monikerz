import React, { useEffect } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useParams } from 'react-router-dom';

import CenterCard from 'common/components/CenterCard';
import Page from 'common/components/Page';

export default function GameOverLayout() {
    const firestore = useFirestore();
    const { gameId, bluePoints, redPoints } = useParams();

    const blue = parseInt(bluePoints, 10);
    const red = parseInt(redPoints, 10);

    useEffect(() => {
        setTimeout(() => {
            firestore.collection('games').doc(gameId).set({
                status: 'complete',
                bluePoints,
                redPoints
            });
        }, Math.random() * 1500);
    }, []);

    return (
        <Page bodyClassName='' title='Game Over'>
            <CenterCard>
                <main className='card flex-column'>
                    <div className='card-header text-center'>
                        <h4 className='mb-0'>Game Over</h4>
                    </div>
                    <div className='card-body text-center'>
                        {blue > red ? (
                            <h4 className='text-primary mb-0'>BLUE WINS!</h4>
                        ) : blue < red ? (
                            <h4 className='text-danger mb-0'>RED WINS!</h4>
                        ) : (
                            <h4 className='text-muted mb-0'>IT'S A TIE!</h4>
                        )}
                    </div>
                </main>
            </CenterCard>
        </Page>
    );
}