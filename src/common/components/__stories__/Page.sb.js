import React from 'react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import '../../../stylesheets/main.scss';
import Page from '../Page';

export default {
    title: 'Page',
    decorators: [withKnobs]
};

export const Default = () => (
    <Page isLoading={boolean('Loading?', false)}
        title={text('Window Title', '')}
        appClassName={text('App Class Name', 'app-body')}
        bodyClassName={text('Body Class Name', '')}>
        Page content
    </Page>
);