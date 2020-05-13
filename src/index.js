import React from 'react';
import { render } from 'react-dom';

import './stylesheets/main.scss';
import 'utilities/fontawesome';

import { App } from './modules/app';

if (process.env.NODE_ENV !== 'development') {
    Honeybadger && Honeybadger.configure({
        apiKey: process.env.HONEYBADGER_API_KEY,
        environment: process.env.NODE_ENV,
        revision: 'master'
    });
}
else {
    if (process.env.DEBUG_RENDER) {
        const whyDidYouRender = require('@welldone-software/why-did-you-render');
        whyDidYouRender(React, {
            trackAllPureComponents: true,
        });
    }
}

render(
    <App />,
    document.getElementById('app')
);