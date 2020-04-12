import React from 'react';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { getStats } from 'data/selectors';

/* Note:
    There seems to be an issue in react-redux-firebase with queries running in an 
    infinite loop if we don't do `.startOf('hour')`.
*/
const queries = [
    {
        collection: 'games',
        where: [
            ['status', '==', 'complete']
        ],
        storeAs: 'completedGames'
    },
    {
        collection: 'games',
        where: [
            ['startedAt', '>=', moment.utc().add(-1, 'hours').startOf('hour').toDate()]
        ],
        storeAs: 'activeGames'
    },
    {
        collection: 'clients',
        where: [
            ['joinedAt', '>=', moment.utc().add(-4, 'hours').startOf('hour').toDate()]
        ],
        storeAs: 'activeClients'
    }
];

export default function Stats() {
    useFirestoreConnect(queries);

    const data = useSelector(getStats);
    const isReady = isLoaded(data);

    return (
        <div className='card mx-4 mt-0'>
            <div className='card-header'>
                <h4>Stats</h4>
            </div>
            <div className='card-body'>
                {isReady ? (
                    <div>
                        <p className='mb-0'>
                            Active Games: <b>{data.activeGames}</b>
                        </p>
                        <p className='mb-0'>
                            Active Clients: <b>{data.activeClients}</b>
                        </p>
                        <p className='mb-0'>
                            Completed Games: <b>{data.completedGames}</b>
                        </p>
                    </div>
                ) : <span className='spinner-border spinner-border-sm mr-1' />}
            </div>
        </div>
    );
}