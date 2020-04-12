import React from 'react';
import GameHeader from '../GameHeader';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';

describe('GameHeader', () => {
    cases('should render teams', opts => {
        const gameState = {
            me: { team: opts.team },
        };
        const { container } = render(<GameHeader gameState={gameState} />);
        expect(container.firstChild).toHaveClass(opts.className);
    }, {
        'blue': { team: 'blue', className: 'header-blue-team' },
        'red': { team: 'red', className: 'header-red-team' }
    });

    it('should render points', () => {
        const gameState = {
            me: { team: 'blue' },
            bluePoints: 25,
            redPoints: 24
        };
        const { getByText } = render(<GameHeader gameState={gameState} />);
        expect(getByText('25')).toHaveClass('badge-primary');
        expect(getByText('24')).toHaveClass('badge-danger');
    });

    cases('should render rounds', opts => {
        const gameState = {
            me: { team: 'blue' },
            round: opts.round
        };
        const { container, queryByText } = render(<GameHeader gameState={gameState} />);
        expect(container).toContainElement(queryByText(opts.text));
    }, {
        1: { round: 0, text: 'Round 1' },
        2: { round: 1, text: 'Round 2' },
        3: { round: 2, text: 'Round 3' }
    });

    it('should render a timer', () => {
        const gameState = {
            me: { team: 'blue' },
            goalTime: new Date()
        };
        const { container, getByText } = render(<GameHeader timeRemaining={60} gameState={gameState} />);
        const element = getByText('60');
        expect(container).toContainElement(element);
    });

    it('should render a time different when running out', () => {
        const gameState = {
            me: { team: 'blue' },
            goalTime: new Date()
        };
        const { container, getByText } = render(<GameHeader timeRemaining={10} gameState={gameState} />);
        const element = getByText('10');
        expect(container).toContainElement(element);
        expect(element).toHaveClass('text-danger');
    });
});