import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import * as Fathom from 'fathom-client';

import Button from 'common/components/Button';
import CenterCard from 'common/components/CenterCard';
import Page from 'common/components/Page';

export default function Start() {
    const firestore = useFirestore();
    const history = useHistory();

    const [joinError, setJoinError] = useState(null);
    const { handleSubmit, register } = useForm();

    async function join(values) {
        if (!values.gameId) {
            return;
        }

        let game = await firestore.collection('games')
            .where('gameId', '==', values.gameId)
            .where('status', '==', 'starting')
            .limit(1)
            .get();

        if (!game || game.empty) {
            setJoinError('No game found with the specified code or the game has already started');
            return;
        }

        const { id } = await firestore.collection('clients').add({
            joinedAt: moment.utc().toDate(),
            gameId: values.gameId
        });

        Fathom.trackGoal('KVNZQLYS', 0);

        history.push(`/play/${values.gameId}/${id}`);
    }

    async function start() {
        const alphabet = [...'abcdefghijklmnopqrstuvwxyz123456789'];

        let gameId = '';
        for (let i = 0; i < 5; i++) {
            gameId += alphabet[Math.floor(Math.random() * alphabet.length)];
        }

        // Try at least a bit to prevent code collisions
        let game = await firestore.collection('games')
            .where('gameId', '==', gameId)
            .limit(1)
            .get();

        if (game && !game.empty) {
            // retry
            return start();
        }

        await firestore.collection('games').add({
            gameId,
            startedAt: moment.utc().toDate(),
            status: 'starting'
        });

        const { id } = await firestore.collection('clients').add({
            gameId,
            joinedAt: moment.utc().toDate(),
            isLeader: true
        });

        Fathom.trackGoal('trackGoal', 'OANOFJNE', 0);

        history.push(`/play/${gameId}/${id}`);
    }

    return (
        <Page bodyClassName='' title='New Game'>
            <CenterCard className='flex-column'>
                <div className='pt-4 text-center'>
                    <div className='d-flex justify-content-center'>
                        <Button className='btn btn-primary btn-lg w-100' onClick={start} async>Create a Game</Button>
                    </div>
                    <span className='separator my-4'>or</span>
                    <p>To join an existing game, enter the code below.</p>
                    <form className='form d-flex flex-column justify-content-center' onSubmit={handleSubmit(join)}>
                        <div className='form-group'>
                            <input type='text'
                                maxLength='5'
                                name='gameId'
                                required
                                className='form-control form-control-lg'
                                ref={register({ required: 'Required '})} />
                        </div>

                        <Button type='submit' className='btn btn-primary btn-lg' async>Join</Button>
                    </form>
                    {joinError ? <p className='text-danger mt-2'>{joinError}</p> : null}
                </div>
            </CenterCard> 
        </Page>
    );
}