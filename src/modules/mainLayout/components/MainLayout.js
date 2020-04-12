import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import routes from '../routes';
import { getGameMetadata } from 'data/selectors';

export default function MainLayout() {
    const gameState = useSelector(getGameMetadata);
    const location = useLocation();

    return (
        <div>
            <nav className='navbar navbar-light bg-light fixed-top'>
                <RouterLink className='navbar-brand mb-0 h1' to='/'>Monikerz</RouterLink>
            </nav>
            { gameState?.game && !/view/.test(location.pathname) ? (
                <div className='d-flex justify-content-center flex-grow-1' style={{ marginTop: '55px', position: 'fixed', width: '100vw' }}>
                    <div>
                        <h3 className='text-primary'>
                            Blue Team
                            <span className='badge badge-pill badge-primary ml-2'>{gameState.game?.bluePoints || 0}</span>
                        </h3>
                    </div>
                    <div className='ml-5'>
                        <h3 className='text-danger'>
                            Red Team
                            <span className='badge badge-pill badge-danger ml-2'>{gameState.game?.redPoints || 0}</span>
                        </h3>
                    </div>
                </div>
            ) : null }
            
            {routes}
        </div>
    );
}