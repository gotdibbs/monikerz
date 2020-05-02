import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import { firebaseReducer as firebase } from 'react-redux-firebase';
import { firestoreReducer as firestore } from 'redux-firestore';

const middlewares = [];
if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_REDUX) {
    const { logger } = require('redux-logger');
    middlewares.push(logger);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
    firebase,
    firestore,
});

const store = createStore(
    combinedReducers,
    composeEnhancers(
        applyMiddleware(...middlewares)
    )
);

export default store;