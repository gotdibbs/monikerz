import React from 'react';
import StartRound from '../StartRound';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';

jest.mock('../GameHeader');

describe('StartRound', () => {
    it('should render points', () => {
        const gameState = {
            teammates: [
                { name: 'Test 1' },
                { name: 'Test 2' }
            ]
        };
        const { container, getByText } = render(<StartRound gameState={gameState} />);
        expect(container).toContainElement(getByText('Test 1, Test 2'));
    });

    cases('should render rounds', opts => {
        const gameState = {
            teammates: [],
            round: opts.round
        };
        const { container, queryByText } = render(<StartRound gameState={gameState} />);
        expect(container).toContainElement(queryByText(opts.regex));
    }, {
        1: { round: 0, regex: /any words/i },
        2: { round: 1, regex: /one word/i },
        3: { round: 2, regex: /charades/i }
    });
});