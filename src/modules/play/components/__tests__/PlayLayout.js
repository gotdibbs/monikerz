import React from 'react';
import PlayLayout from '../PlayLayout';
import { render } from '@testing-library/react';
import * as ReactRedux from 'react-redux';
import { initialState } from '../__mocks__/machineStates';

const useSelector = ReactRedux.useSelector;
ReactRedux.useSelector = jest.fn();

jest.mock('react-redux-firebase', () => {
    return {
        isLoaded: function () {
            return !Array.prototype.slice.call(arguments, 0).find(arg => arg?.isLoaded === false);
        },
        useFirestoreConnect: () => { }
    };
});

const MOCK_GAME_ID = 'abcde';
jest.mock('react-router-dom', () => {
    return {
        Redirect: ({ to }) => { return to; },
        useParams: () => ({
            gameId: MOCK_GAME_ID,
            clientId: 2 
        })
    };
});

jest.mock('../GameManager', () => {
    const GameManager = ({ gameState: { gameId } }) => <div>{gameId}</div>;
    return GameManager;
});

jest.mock('common/components/Loading');

describe('PlayLayout', () => {
    afterEach(() => {
        jest.clearAllMocks();
        ReactRedux.useSelector.mockImplementation(useSelector);
    });

    it('should render a loading state', () => {
        ReactRedux.useSelector.mockImplementation(_ => ({ isLoaded: false }));
        const { container, getByTestId } = render(<PlayLayout />);
        expect(container).toContainElement(getByTestId('loading'));
    });

    it('should render an error when there is no game found', () => {
        ReactRedux.useSelector.mockImplementation(_ => ({ gameId: null }));
        const { container, getByText } = render(<PlayLayout />);
        expect(container).toContainElement(getByText('Game Not Found!'));
    });

    it('should redirect on completion', () => {
        ReactRedux.useSelector.mockImplementation(_ => ({
            gameId: MOCK_GAME_ID,
            status: 'complete'
        }));

        const { container, getByText } = render(<PlayLayout />);
        expect(container).toContainElement(getByText(/gameover/i));
    });

    it('should render a game', () => {
        ReactRedux.useSelector.mockImplementation(_ => ({
            gameId: MOCK_GAME_ID
        }));

        const {container, getByText } = render(<PlayLayout />);
        expect(container).toContainElement(getByText(MOCK_GAME_ID));
    });

    it('should render a game and pass state', () => {
        ReactRedux.useSelector.mockImplementation(_ => ({
            gameId: MOCK_GAME_ID,
            me: { state: JSON.stringify(initialState) }
        }));

        const {container, getByText } = render(<PlayLayout />);
        expect(container).toContainElement(getByText(MOCK_GAME_ID));
    });
});