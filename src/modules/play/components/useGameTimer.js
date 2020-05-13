import { useEffect, useState } from 'react';
import moment from 'moment';

export default function useGameTimer(gameStateRef, endTurn) {
    const [timeRemaining, setTimeRemaining] = useState(null);

    // Timer is running if it's set in firestore or on the window already
    // Appears to be some weird edge case where goalTime clears for a second
    const isTimerRunning = gameStateRef.current.goalTime != null || window.__monikerz__game_timer;

    function killTimer() {
        // Prevent latent timers from hanging around if all the cards are gone
        clearTimeout(window.__monikerz__game_timer);
        window.__monikerz__game_timer = null;
    }

    useEffect(() => {
        /*
            This effect should only trigger at three times:
            1. component mount
            2. `startTurn`
            3. `endTurn`
        */
        if (gameStateRef.current.goalTime == null) {
            return;
        }

        const secondsLeft = moment(gameStateRef.current.goalTime.toDate()).diff(moment(), 'seconds');
        setTimeRemaining(Math.max(secondsLeft, 0));

        // Wait separately for the end of the round to not muddy the timers
        if (gameStateRef.current.isMyTurn && !window.__monikerz__game_timer) {
            // Lock the timer, otherwise everytime the `gameState` updates this gets re-registered
            window.__monikerz__game_timer = setTimeout(() => {
                const isEndOfRound = gameStateRef.current.cardPile.length === 0;

                window.__monikerz__game_timer = null;

                Honeybadger && Honeybadger.addBreadcrumb('Round timer expired');
                endTurn(isEndOfRound);
            }, secondsLeft * 1000);
        }
    }, [gameStateRef.current.goalTime]);

    useEffect(() => {
        /*
            This effect should only trigger in three scenarios:
            1. Component mount
            2. Once on `startTurn` (via the previous effect)
            3. Every 1 second as this effect re-runs itself
        */
        if (gameStateRef.current.goalTime == null) {
            return;
        }

        setTimeout(() => {
            if (gameStateRef.current.goalTime == null) {
                return;
            }

            const secondsLeft = moment(gameStateRef.current.goalTime.toDate()).diff(moment(), 'seconds');

            setTimeRemaining(Math.max(secondsLeft, 0));
        }, 1000);
    }, [timeRemaining]);

    return [isTimerRunning, timeRemaining, killTimer];
}