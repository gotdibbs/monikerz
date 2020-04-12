import React, { useEffect } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useMachine } from '@xstate/react';

import CenterCard from 'common/components/CenterCard';
import Page from 'common/components/Page';
import InitPlayer from './InitPlayer';
import SelectCards from './SelectCards';
import Lobby from './Lobby';
import Kicked from './Kicked';
import Game from './Game';
import gameMachine from '../gameMachine';

export default function GameManager({ gameState, machineState }) {
    const firestore = useFirestore();

    const [state, send] = useMachine(gameMachine, {
        devTools: true,
        state: machineState
    });

    useEffect(() => {
        if (!gameState.me?.id) {
            return;
        }

        firestore.collection('clients').doc(gameState.me.id).update({
            state: JSON.stringify(state)
        });

        window.scrollTo(0, 0);
    }, [state]);

    useEffect(() => {
        // We only want to pass the properties which will actually trigger change
        send('remote_update', {
            meId: gameState.me?.id,
            isMyTurn: gameState.isMyTurn,
            isReady: gameState.isReady,
            iHaveCards: !!gameState.me?.cards
        });
    }, [gameState]);

    return (
        <Page bodyClassName='' title={gameState.gameId}>
            <CenterCard>
                {(() => {
                    switch (true) {
                        case state.matches('setup'):
                            return <InitPlayer gameState={gameState} next={send} />;

                        case state.matches('wait_for_players'):
                            return <Lobby gameState={gameState} next={send} />;

                        case state.matches('select_cards'):
                            return <SelectCards gameState={gameState} next={send} />;

                        case state.matches('play'):
                            return <Game gameState={gameState}
                                next={send}
                                subState={state.value.play} />;

                        case state.matches('user_kicked'):
                            return <Kicked />;

                        default:
                            return (
                                <div>Woah unknown game state! Not your fault, but some incompetent dev needs to be chastised.</div>
                            );
                    }
                })()}
            </CenterCard>
        </Page>
    );
}