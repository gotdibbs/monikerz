import React from 'react';
import { withKnobs, select, number, text } from '@storybook/addon-knobs';

import '../../../../stylesheets/main.scss';
import Card from '../Card';
import Cards from 'data/cards';

export default {
    title: 'Card',
    decorators: [withKnobs]
};

export const Default = () => {
    const indexParameter = number(
        'Card Index',
        0,
        {
            range: false,
            min: 0,
            max: Cards.length - 1,
            step: 1
        }
    );

    const hints = select(
        'Hints',
        {
            none: {},
            topRight: {
                topRight: 'Top Right'
            },
            bottomLeftOnHover: {
                bottomLeft: 'Bottom Left'
            },
            bottomRightOnHover: {
                bottomRight: 'Bottom Right'
            }
        },
        'none'
    );

    return <Card cardIndex={indexParameter}
        border={text('Border Style', '1px solid transparent')}
        hints={hints} />;
};