import React, { useEffect, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import * as Fathom from 'fathom-client';

import Loading from 'common/components/Loading';
import CenterCard from 'common/components/CenterCard';
import Page from 'common/components/Page';

export default function AutoJoin() {
    const firestore = useFirestore();
    const history = useHistory();
    const { gameId } = useParams();
    const [joinError, setJoinError] = useState(null);

    async function join() {
        if (!gameId) {
            return;
        }

        let game = await firestore.collection('games')
            .where('gameId', '==', gameId)
            .where('status', '==', 'starting')
            .limit(1)
            .get();

        if (!game || game.empty) {
            setJoinError('No game found with the specified code or the game has already started');
            return;
        }

        const { id } = await firestore.collection('clients').add({
            joinedAt: moment.utc().toDate(),
            gameId
        });

        history.replace(`/play/${gameId}/${id}`);
    }

    useEffect(() => {
        Fathom.trackGoal('WQ7SWMAG', 0);
        setTimeout(() => join(), 500);
    }, []);

    if (joinError) {
        return (
            <Page bodyClassName='' title='Error'>
                <CenterCard>
                    <div className='card'>
                        <div className='card-header bg-warning'>
                            Game not found or already in progress!
                        </div>
                    </div>
                </CenterCard>
            </Page>
        );
    }

    return <Loading />;
}