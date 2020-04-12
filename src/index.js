import React from 'react';
import { render } from 'react-dom';

import './stylesheets/main.scss';
import 'utilities/fontawesome';

import { App } from './modules/app';

if (process.env.NODE_ENV !== 'development') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, {
        trackAllPureComponents: true,
    });

    Honeybadger.configure({
        apiKey: process.env.HONEYBADGER_API_KEY,
        environment: process.env.NODE_ENV,
        revision: 'master'
    });
}

render(
    <App />,
    document.getElementById('app')
);