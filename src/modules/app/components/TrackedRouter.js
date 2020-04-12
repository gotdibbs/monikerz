import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actionTypes } from 'redux-firestore';
import { Route, useLocation } from 'react-router-dom';
import * as Fathom from 'fathom-client';

var lastLocation = null;

export default function TrackedRouter({ component }) {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (!/play/.test(location.pathname)) {
            // Reset firestore state
            dispatch({ type: actionTypes.CLEAR_DATA });
        }
    }, [location]);

    if (process.env.NODE_ENV === 'development') {
        return (
            <Route path="/" component={ component } />
        );
    }


    useEffect(() => {
        Fathom.load();
        Fathom.setSiteId(process.env.FATHOM_SITE_ID);
    }, []);

    if (lastLocation !== location.pathname) {
        Fathom.trackPageview();
        lastLocation = location.pathname;
    }

    return (
        <Route path="/" component={ component } />
    );
}