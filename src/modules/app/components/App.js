import React, { Component} from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter} from 'react-router-dom';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';

import ScrollToTop from 'common/components/ScrollToTop';
import firebase from 'data/firebase';
import store from '../store';
import { MainLayout } from 'modules/mainLayout';

import TrackedRouter from './TrackedRouter';

const rrfProps = {
    firebase,
    config: {
        attachAuthIsReady: false,
        allowMultipleListeners: true,
        enableLogging: process.env.NODE_ENV === 'development'
    },
    createFirestoreInstance,
    dispatch: store.dispatch
};

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ReactReduxFirebaseProvider {...rrfProps}>
                    <BrowserRouter>
                        <ScrollToTop>
                            <TrackedRouter component={ MainLayout } />
                        </ScrollToTop>
                    </BrowserRouter>
                </ReactReduxFirebaseProvider>
            </Provider>
        );
    }
}

export default App;
