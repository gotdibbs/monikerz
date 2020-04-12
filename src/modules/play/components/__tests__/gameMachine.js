import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import { createModel } from '@xstate/test';
import GameManager from '../GameManager';
import gameMachine from '../../gameMachine';

jest.mock('react-redux-firebase');
jest.unmock('@xstate/react');

function mockTimestamp(date) {
    return {
        toDate: () => date
    };
}

const DEFAULT_GAME_STATE = {
    gameId: 'ABCDE',
    me: {
        id: '1234',
        cards: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        isLeader: true,
        team: 'red'
    },
    player: {
        name: 'test',
        team: 'blue'
    },
    hasMinimumPlayers: true,
    clients: [{
        selected_cards: [0, 1, 2, 3, 4]
    }],
    blueTeam: [
        { order: 0 },
        { order: 1 }
    ],
    redTeam: [],
    teammates: [],
    deck: [0, 1, 2, 3, 4],
    cardPile: [0, 1, 2, 3, 4]
};

const gameModel = createModel(gameMachine, {
    events: {
        setup_complete: {
            exec: async ({ getByTestId }, event) => {
                fireEvent.change(getByTestId('nickname'), {
                    target: { value: event.nickname }
                });

                fireEvent.click(getByTestId(event.teamName));

                fireEvent.submit(getByTestId('player-form'));
            },
            cases: [
                { nickname: 'Test', teamName: 'blue-team', team: 'blue' },
                { nickname: 'Test', teamName: 'red-team', team: 'red' }
            ]
        },
        remote_update: {
            exec: async ({ rerender }) => {
                const gameState = {
                    ...DEFAULT_GAME_STATE,
                    me: null
                };

                rerender(<GameManager gameState={gameState} />);
            }
        },
        ready: {
            exec: async ({ findByText, getByTestId }) => {
                fireEvent.click(getByTestId('deal-cards'));

                await findByText(/Loading/i);
            }
        },
        back: {
            exec: async ({ getByTestId }) => {
                fireEvent.click(getByTestId('lobby-back'));
            }
        },
        select_wait: {
            exec: async ({ findByText, getByTestId, rerender }) => {
                for (let i = 0; i < 7; i++) {
                    fireEvent.click(getByTestId('select-keep'));
                }

                rerender(<GameManager gameState={{
                    ...DEFAULT_GAME_STATE,
                    isMyTurn: false,
                    isReady: false
                }} />);

                fireEvent.click(getByTestId('select-ready'));

                await findByText(/Loading/i);
            }
        },
        select_start: {
            exec: async ({ findByText, getByTestId, rerender }) => {
                for (let i = 0; i < 7; i++) {
                    fireEvent.click(getByTestId('select-keep'));
                }

                rerender(<GameManager gameState={{
                    ...DEFAULT_GAME_STATE,
                    isMyTurn: true,
                    isReady: true
                }} />);

                fireEvent.click(getByTestId('select-ready'));

                await findByText(/Loading/i);
            }
        },
        select_view: {
            exec: async ({ findByText, getByTestId, rerender }) => {
                for (let i = 0; i < 7; i++) {
                    fireEvent.click(getByTestId('select-keep'));
                }
         
                rerender(<GameManager gameState={{
                    ...DEFAULT_GAME_STATE,
                    isMyTurn: false,
                    isReady: true
                }} />);

                fireEvent.click(getByTestId('select-ready'));

                await findByText(/Loading/i);
            }
        },
        start: {
            exec: async ({ findByText, getByTestId }) => {
                fireEvent.click(getByTestId('round-start'));

                await findByText(/Loading/i);
            }
        },
        turn_end: {
            exec: async ({ findByText, getByTestId, rerender }) => {
                let goalTime = new Date();
                goalTime.setMinutes((new Date()).getMinutes() + 1);

                const gameState = {
                    ...DEFAULT_GAME_STATE,
                    isMyTurn: true,
                    isReady: true,
                    goalTime: new mockTimestamp(goalTime),
                    round: 0
                };

                rerender(<GameManager gameState={gameState} />);

                for (let i = 0; i < 5; i++) {
                    await fireEvent.click(getByTestId('got-it'));

                    if (i < 4) {
                        await findByText(/Loading/i);

                        await rerender(<GameManager gameState={{
                            ...gameState,
                            cardPile: DEFAULT_GAME_STATE.cardPile.slice(0, DEFAULT_GAME_STATE.cardPile.length - (i+1))
                        }} />);
                    }
                }
            }
        },
        game_end: {
            exec: async ({ findByText, getByTestId, rerender }) => {
                let goalTime = new Date();
                goalTime.setMinutes((new Date()).getMinutes() + 1);

                const gameState = {
                    ...DEFAULT_GAME_STATE,
                    isMyTurn: true,
                    isReady: true,
                    goalTime: new mockTimestamp(goalTime),
                    round: 2
                };

                rerender(<GameManager gameState={gameState} />);

                for (let i = 0; i < 5; i++) {
                    await fireEvent.click(getByTestId('got-it'));

                    if (i < 4) {
                        await findByText(/Loading/i);

                        await rerender(<GameManager gameState={{
                            ...gameState,
                            cardPile: DEFAULT_GAME_STATE.cardPile.slice(0, DEFAULT_GAME_STATE.cardPile.length - (i+1))
                        }} />);
                    }
                }
            }
        }
    }
});

describe('gameMachine', () => {
    // We don't want shortest paths because that won't hit `< back` events/scenarios
    const testPlans = gameModel.getSimplePathPlans();
  
    testPlans.forEach(plan => {
        describe(plan.description, () => {
            plan.paths.forEach(path => {
                it(path.description, async () => {
                    await act(async () => {
                        const rendered = render(<GameManager gameState={DEFAULT_GAME_STATE} />);

                        return path.test(rendered);
                    });
                });
            });
        });
    });
  
    it('should have full coverage', () => {
        return gameModel.testCoverage({
            filter: stateNode => !!stateNode.meta
        });
    });
});