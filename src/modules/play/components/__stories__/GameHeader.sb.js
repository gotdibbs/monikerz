import React from 'react';
import { withKnobs, optionsKnob as options, number, select } from '@storybook/addon-knobs';

import '../../../../stylesheets/main.scss';
import GameHeader from '../GameHeader';

export default {
    title: 'GameHeader',
    decorators: [withKnobs]
};

export const Default = () => {
    const gameState = {
        goalTime: select(
            'Is Timer Running?',
            {
                'Yes': true,
                'No': null
            },
            null,
            'Timer'
        ),
        me: {
            team: select(
                'Team',
                {
                    blue: 'blue',
                    red: 'red'
                },
                'blue'
            )
        },
        round: number(
            'Round',
            0,
            {
                range: false,
                step: 1,
                min: 0,
                max: 2
            }
        ),
        bluePoints: number(
            'Blue Points',
            15,
            {
                range: false,
                step: 1,
                min: 0,
                max: 100
            }
        ),
        redPoints: number(
            'Red Points',
            10,
            {
                range: false,
                step: 1,
                min: 0,
                max: 100
            }
        )
    };

    const timeRemaining = number(
        'Time Remaining (seconds)',
        37,
        {
            range: false,
            step: 1,
            min: 0,
            max: 60
        },
        'Timer'
    );

    return <GameHeader gameState={gameState} timeRemaining={timeRemaining} />;
};