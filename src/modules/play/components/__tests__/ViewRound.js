import React from 'react';
import ViewGame from '../ViewRound';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';

jest.mock('../Card');

describe('ViewRound', () => {
    it('should render my blue team', () => {
        const gameState = {
            me: { team: 'blue' },
            player: {
                name: 'ted',
                team: 'blue'
            }
        };
        const { container, queryByText } = render(<ViewGame timeRemaining gameState={gameState} />);
        expect(container).toContainElement(queryByText('Blue Team'));
        expect(container).not.toContainElement(queryByText('Red Team'));
        expect(container).toContainElement(queryByText(/your team/i));
    });

    it('should render my red team', () => {
        const gameState = {
            me: { team: 'red' },
            player: {
                name: 'ted',
                team: 'red'
            }
        };
        const { container, queryByText } = render(<ViewGame timeRemaining gameState={gameState} />);
        expect(container).not.toContainElement(queryByText('Blue Team'));
        expect(container).toContainElement(queryByText('Red Team'));
        expect(container).toContainElement(queryByText(/your team/i));
    });

    it('should support rendering not my team', () => {
        const gameState = {
            me: { team: 'red' },
            player: {
                name: 'ted',
                team: 'blue'
            }
        };
        const { container, queryByText } = render(<ViewGame timeRemaining gameState={gameState} />);
        expect(container).toContainElement(queryByText('Blue Team'));
        expect(container).not.toContainElement(queryByText('Red Team'));
        expect(container).not.toContainElement(queryByText(/your team/i));
    });

    it('should render the last card played', () => {
        const gameState = {
            me: { team: 'blue' },
            lastCard: 1,
            player: {
                name: 'ted',
                team: 'blue'
            }
        };
        const { container, getByTestId } = render(<ViewGame timeRemaining gameState={gameState} />);

        const card = getByTestId('card');
        expect(container).toContainElement(card);
        expect(card.textContent).toBe('' + gameState.lastCard);
    });

    cases('should render rounds', opts => {
        const gameState = {
            me: { team: 'blue' },
            round: opts.round,
            player: {
                name: 'ted',
                team: 'blue'
            }
        };
        const { container, getByText} = render(<ViewGame timeRemaining gameState={gameState} />);
        expect(container).toContainElement(getByText(opts.text));
    }, {
        'round 1': { round: 0, text: /any words/i },
        'round 2': { round: 1, text: /one word/i },
        'round 3': { round: 2, text: /charades/i }
    });
});