import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import moment from 'moment';

import Cleaner from './Cleaner';

export default function CleanOldClients() {
    const firestore = useFirestore();
    const [isBusy, setIsBusy] = useState(false);

    async function clean(_, cleanCount = 0) {
        setIsBusy(true);
        let queryResult = await firestore.collection('clients')
            .where('joinedAt', '<=', moment.utc().add(-4, 'hours').toDate())
            .limit(50)
            .get();

        if (!queryResult || queryResult.empty) {
            alert(cleanCount === 0 ? 'Nothing to clean' : `Cleaned ${cleanCount} records`);
            setIsBusy(false);
            return;
        }

        const batch = firestore.batch();
        for (let i = 0, len = queryResult.size; i < len; i++) {
            batch.delete(queryResult.docs[i].ref);
        }
        await batch.commit();

        clean(_, cleanCount + queryResult.size);
    }

    return (
        <Cleaner config={{
            title: 'Client Cleanup',
            description: 'Remove clients older than 4 hours',
            clean,
            isBusy
        }} />
    );
}