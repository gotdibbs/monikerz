import React, { useRef, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import NoSleepJs from 'nosleep.js';
import * as Fathom from 'fathom-client';

import Cards from 'data/cards';
import GameOver from './GameOver';
import PlayRound from './PlayRound';
import StartRound from './StartRound';
import useGameTimer from './useGameTimer';
import ViewRound from './ViewRound';
import WaitKick from './WaitKick';

// For debugging
const ROUND_TIME = 60;

function getNextPlayer(currentPlayer, gameState) {
    if (currentPlayer.team === 'blue') {
        const team = gameState.redTeam.sort((a, b) => a.order - b.order);
        const nextOrder = ((gameState.lastTurnPlayerOrder || 0) + 1) % team.length;
        return team[nextOrder].id;
    }
    else if (currentPlayer.team === 'red') {
        const team = gameState.blueTeam.sort((a, b) => a.order - b.order);
        const nextOrder = ((gameState.lastTurnPlayerOrder || 0) + 1) % team.length;
        return team[nextOrder].id;
    }
}

export default function Game({ gameState, next, subState }) {
    const firestore = useFirestore();
    const [cardIndex, setCardIndex] = useState(0);

    // Cache values for use in closures
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;
    const cardIndexRef = useRef(cardIndex);
    cardIndexRef.current = cardIndex;

    const [isTimerRunning, timeRemaining, killTimer] = useGameTimer(gameStateRef, endTurn);
    
    // Only lookup the current card if we need to show it
    const card = isTimerRunning ?
        gameState.cardPile[cardIndex] : null;

    async function startTurn() {
        try {
            if (!window._nosleep) {
                window._nosleep = new NoSleepJs();
            }
            window._nosleep && window._nosleep.enable();
        }
        catch (e) { /* ignore nosleep fragility */ }
        
        let deck = gameState.cardPile || gameState.deck;

        if (!deck) {
            deck = gameState.clients
                .map(c => c.selected_cards)
                .reduce((prev, curr) => (prev || []).concat(curr))
                .sort(_ => Math.random() - 0.5);

            await firestore.collection('games').doc(gameState.id).update({
                deck
            });
        }

        setCardIndex(0);

        var target = new Date();
        // Add an extra second to account for network delays
        target.setSeconds(target.getSeconds() + ROUND_TIME + 1);

        await firestore.collection('games').doc(gameState.id).update({
            cardPile: [...deck],
            goalTime: target
        });

        next('start');

        Honeybadger && Honeybadger.addBreadcrumb('Start turn');
    }

    async function endTurn(isEndOfRound, partialUpdate) {
        const nextPlayerId = getNextPlayer(gameStateRef.current.me, gameStateRef.current);
        const currentPlayerOrder = gameStateRef.current.me.order;

        let remainingCards = null;

        if (isEndOfRound !== true) {
            let cardPileCopy = [...gameStateRef.current.cardPile];
            // Shuffle the current card to the bottom of the deck
            let nextCardIndex = (cardIndexRef.current + 1) % cardPileCopy.length;
            remainingCards = [...cardPileCopy.splice(nextCardIndex, cardPileCopy.length)].concat(...cardPileCopy);
        }
        else {
            if (gameStateRef.current.round === 2) {
                await cleanup();
            }
            else {
                remainingCards = [...gameStateRef.current.deck].sort(_ => Math.random() - 0.5);
            }
            Fathom.trackGoal('VROOIDN2', 0);
        }

        await firestore.collection('games').doc(gameStateRef.current.id).update({
            ...partialUpdate,
            turn: nextPlayerId,
            lastTurnPlayerOrder: currentPlayerOrder,
            cardPile: remainingCards,
            round: isEndOfRound === true ? (gameStateRef.current.round || 0) + 1 : (gameStateRef.current.round || 0),
            goalTime: null
        });

        next('turn_end');

        try {
            window._nosleep && window._nosleep.disable();
        }
        catch(e) { /* ignore nosleep fragility */ }

        Honeybadger && Honeybadger.addBreadcrumb('End turn', {
            metadata: { isEndOfRound }
        });
    }

    async function cleanup() {
        Fathom.trackGoal('XC7O15LL', 0);

        next('game_end');

        const batch = firestore.batch();

        // Remove all clients
        (gameState.clients || []).forEach(client => {
            batch.delete(firestore.collection('clients').doc(client.id));
        });

        // Force redirect to /gameover
        batch.update(firestore.collection('games').doc(gameState.id), {
            status: 'complete'
        });

        await batch.commit();

        Honeybadger && Honeybadger.addBreadcrumb('Cleanup');
    }

    async function correct() {
        let remainingCards = gameStateRef.current.cardPile.filter(c => c !== card);
        const player = gameStateRef.current.player;

        const currentCardPoints = parseInt(Cards[card]?.points, 10);
        const currentTeamPoints = parseInt(gameStateRef.current[`${player.team}Points`] || 0, 10);
        const nextPoints = (isNaN(currentTeamPoints) ? 0 : currentTeamPoints) + 
            (isNaN(currentCardPoints) ? 0 : currentCardPoints);
        
        const update = {
            lastCard: card,
            [`${player.team}Points`]: nextPoints,
            cardPile: remainingCards
        };
        const isEndOfRound = remainingCards.length === 0;

        Honeybadger && Honeybadger.addBreadcrumb('Correct answer', {
            metadata: { isEndOfRound }
        });

        // If we're at the end of the turn, let the endTurn logic handle updating
        if (isEndOfRound) {
            killTimer();
            
            await endTurn(true, update);
        }
        else {
            setCardIndex(index => index % remainingCards.length);
            
            await firestore.collection('games').doc(gameState.id).update(update);
        }
    }

    function cycle() {
        // Purposefully only allow forward movement
        setCardIndex(index => (index + 1) % gameStateRef.current.cardPile.length);
    }

    switch (subState) {
        case 'waiting':
            return <WaitKick gameState={gameState} />;
        case 'starting':
            return <StartRound gameState={gameState}
                timeRemaining={timeRemaining}
                startTurn={startTurn} />;
        case 'playing':
            return <PlayRound gameState={gameState}
                timeRemaining={timeRemaining}
                card={card}
                cardIndex={cardIndex}
                cycle={cycle}
                correct={correct} />;
        case 'view':
            return <ViewRound gameState={gameState}
                timeRemaining={timeRemaining} />;
        case 'ending':
            return <GameOver />;
        default:
            return <div>Unknown state. Uh oh. Some dev is in trouble.</div>;
    }
}