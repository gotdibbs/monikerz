import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

import '../../../stylesheets/main.scss';
import CenterCard from '../CenterCard';

export default {
    title: 'CenterCard',
    decorators: [withKnobs]
};

export const Default = () => (
    <CenterCard className={text('Additional Class Name')}>
        Card content should be centered
    </CenterCard>
);