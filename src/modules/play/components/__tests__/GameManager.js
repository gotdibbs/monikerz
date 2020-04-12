import React from 'react';
import { render } from '@testing-library/react';
import { useFirestore } from 'react-redux-firebase';
import { useMachine } from '@xstate/react';
import GameManager from '../GameManager';

jest.mock('react-redux-firebase');
jest.mock('@xstate/react');

describe('GameManager', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render', () => {
        const gameState = {
            gameId: 'ABCDE',
            me: { id: '1234' }
        };

        useMachine.state.matches.mockImplementation(query => query === 'setup');

        const { container, getByTestId } = render(<GameManager gameState={gameState} />);
        expect(container).toContainElement(getByTestId('InitPlayer'));
        expect(useFirestore.mocks.collection).toHaveBeenCalledWith('clients');
        expect(useFirestore.mocks.collection.doc).toHaveBeenCalledWith(gameState.me.id);
        expect(useFirestore.mocks.collection.doc.update).toHaveBeenCalled();
        expect(useFirestore.mocks.collection.doc.update).toHaveBeenCalledTimes(1);
    });

    it('should trigger a state persistence run on state update', () => {
        const gameState = {
            gameId: 'ABCDE',
            me: { id: '1234' },
            blueTeam: [],
            redTeam: []
        };

        useMachine.state.matches.mockImplementation(query => query === 'setup');
        const { container, getByTestId, rerender } = render(<GameManager gameState={gameState} />);

        useMachine.state = {
            matches: jest.fn(query => query === 'wait_for_players')
        };
        rerender(<GameManager gameState={gameState} />);

        expect(container).toContainElement(getByTestId('Lobby'));
        expect(useFirestore.mocks.collection.doc.update).toHaveBeenCalledTimes(2);
    });

    it('should trigger an update if firestore updates', () => {
        const gameState = {
            gameId: 'ABCDE',
            me: { id: '1234' }
        };

        useMachine.state.matches.mockImplementation(query => query === 'setup');
        const { rerender } = render(<GameManager gameState={gameState} />);
        expect(useMachine.send).toHaveBeenCalledTimes(1);
        
        rerender(<GameManager gameState={{ ...gameState }} />);

        expect(useMachine.send).toHaveBeenCalledTimes(2);
    });
});