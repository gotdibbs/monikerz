import React from 'react';
import { Helmet } from 'react-helmet';

import Loading from './Loading';

export default function Page({ appClassName='app-body', bodyClassName = '', children, isLoading, title }) {
    return (
        <main className={appClassName}>
            <Helmet>
                <title>{title ? `Monikerz - ${title}` : 'Monikerz'}</title>
            </Helmet>
            
            <div className={bodyClassName}>
                {isLoading ? <Loading /> : children}
            </div>
        </main>
    );
}