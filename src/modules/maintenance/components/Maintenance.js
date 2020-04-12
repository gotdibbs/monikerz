import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Page from 'common/components/Page';
import CleanOldClients from './CleanOldClients';
import CleanOldGames from './CleanOldGames';
import CleanCompletedGames from './CleanCompletedGames';
import Stats from './Stats';

export default function Maintenace() {
    const { runId } = useParams();

    if (runId !== 'h3r0') {
        return <Redirect to='/' />;
    }

    return (
        <Page title='Maintenance'>
            <div className='d-flex flex-wrap pt-4'>
                <Stats />
                <CleanOldGames />
                <CleanOldClients />
                <CleanCompletedGames />
            </div>
        </Page>
    );
}