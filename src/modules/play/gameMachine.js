import { Machine } from 'xstate';

export default Machine({
    initial: 'setup',
    states: {
        setup: {
            on: {
                setup_complete: 'wait_for_players'
            },
            meta: {
                test: async renderResult => {
                    await renderResult.findByTestId('InitPlayer');
                }
            }
        },
        wait_for_players: {
            on: {
                ready: 'select_cards',
                back: 'setup',
                remote_update: [
                    { target: 'select_cards', cond: 'iHaveCards' }
                ]
            },
            meta: {
                test: async renderResult => {
                    await renderResult.findByTestId('Lobby');
                }
            }
        },
        select_cards: {
            on: {
                select_wait: 'play.waiting',
                select_start: 'play.starting',
                select_view: 'play.view'
            },
            meta: {
                test: async renderResult => {
                    await renderResult.findByTestId('SelectCards');
                }
            }
        },
        play: {
            initial: 'waiting',
            states: {
                waiting: {
                    on: {
                        remote_update: [
                            { target: 'view', cond: 'arePlayersReadyButNotMyTurn' },
                            { target: 'starting', cond: 'arePlayersReadyAndMyTurn' }
                        ]
                    },
                    meta: {
                        test: async renderResult => {
                            await renderResult.findByTestId('WaitKick');
                        }
                    }
                },
                view: {
                    on: {
                        remote_update: [
                            { target: 'starting', cond: 'isMyTurn' }
                        ]
                    },
                    meta: {
                        test: async renderResult => {
                            await renderResult.findByTestId('ViewRound');
                        }
                    }
                },
                starting: {
                    on: {
                        start: 'playing'
                    },
                    meta: {
                        test: async renderResult => {
                            await renderResult.findByTestId('StartRound');
                        }
                    }
                },
                playing: {
                    on: {
                        turn_end: 'view',
                        game_end: 'ending'
                    },
                    meta: {
                        test: async renderResult => {
                            await renderResult.findByTestId('PlayRound');
                        }
                    }
                },
                ending: {
                    type: 'final',
                    meta: {
                        test: async renderResult => {
                            await renderResult.findByTestId('GameOver');
                        }
                    }
                }
            }
        },
        user_kicked: {
            meta: {
                test: async renderResult => {
                    await renderResult.findByTestId('Kicked');
                }
            }
        }
    },
    on: {
        remote_update: [
            { target: 'user_kicked', cond: { type: 'isMeNoMore' } }
        ]
    }
},
{
    guards: {
        isMeNoMore: (_, { meId }) => {
            return !meId;
        },
        isMyTurn: (_, { isMyTurn }) => {
            return isMyTurn;
        },
        arePlayersReadyButNotMyTurn: (_, { isMyTurn, isReady }) => {
            return isReady && !isMyTurn;
        },
        arePlayersReadyAndMyTurn: (_, { isMyTurn, isReady }) => {
            return isReady && isMyTurn;
        },
        iHaveCards: (_, { iHaveCards }) => {
            return iHaveCards;
        }
    }
});