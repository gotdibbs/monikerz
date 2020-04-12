import { createSelector } from 'reselect';
import { isLoaded } from 'react-redux-firebase';

export const NOT_LOADED = { isLoaded: false };

const getFirestoreData = (state) => {
    if (!state.firestore || !state.firestore.data) {
        return NOT_LOADED;
    }

    return state.firestore.data;
};

function arrayify(firestoreData, doSort = false) {
    if (!firestoreData) {
        return firestoreData;
    }

    let result = [];
    for (var id in firestoreData) {
        if (!firestoreData[id]) {
            continue;
        }
        result.push({
            id,
            ...firestoreData[id]
        });
    }

    if (doSort) {
        return result.sort((a, b) => a.id - b.id);
    }

    return result;
}

function countify(firestoreData) {
    if (!firestoreData) {
        return 0;
    }

    return Object.keys(firestoreData).length;
}

export const getGame = createSelector(
    [ getFirestoreData ],
    (data) => {
        if (!data) {
            return NOT_LOADED;
        }

        if (!isLoaded(data.games)) {
            return NOT_LOADED;
        }

        const games = arrayify(data.games);

        return games?.length > 0 ? games[0] : null;
    }
);

export const getClients = createSelector(
    [ getFirestoreData ],
    (data) => {
        if (!data) {
            return NOT_LOADED;
        }

        if (!isLoaded(data.clients)) {
            return NOT_LOADED;
        }

        return arrayify(data.clients);
    }
);

const getClientId = (_, clientId) => clientId;

export const getGameMetadata = createSelector(
    [ getClientId, getGame, getClients ],
    (clientId, game, clients) => {
        if (!isLoaded(game, clients)) {
            return NOT_LOADED;
        }

        const playerCount = clients?.length || 0;
        const blueTeam = (clients || []).filter(c => c.team === 'blue');
        const blueTeamCount = blueTeam?.length || 0;
        const redTeam = (clients || []).filter(c => c.team === 'red');
        const redTeamCount = redTeam?.length || 0;
        const hasMinimumPlayers = (clients || []).filter(c => c.name && c.team).length >= 2 &&
            blueTeamCount > 0 && redTeamCount > 0;
        const leader = (clients || []).find(c => c.isLeader);
        const player = (clients || []).find(player => player.id === game.turn);
        const isReady = !(clients || []).find(c => !c.selected_cards);

        let me,
            teammates,
            isMyTurn;
        if (clientId) {
            me = (clients || []).find(c => c.id === clientId);
            teammates = (clients || []).filter(c => c.team === me?.team);
            isMyTurn = player && me?.id === player?.id;
        }

        return {
            ...game,
            clients,
            me,
            leader,
            player,
            teammates,

            playerCount,
            hasMinimumPlayers,
            isReady,
            isMyTurn,
            blueTeam,
            blueTeamCount,
            redTeam,
            redTeamCount
        };
    }
);

const getCompletedGames = createSelector(
    [ getFirestoreData ],
    (data) => {
        if (!data) {
            return NOT_LOADED;
        }

        if (!isLoaded(data.completedGames)) {
            return NOT_LOADED;
        }

        return countify(data.completedGames);
    }
);

const getActiveGames = createSelector(
    [ getFirestoreData ],
    (data) => {
        if (!data) {
            return NOT_LOADED;
        }

        if (!isLoaded(data.activeGames)) {
            return NOT_LOADED;
        }

        return countify(data.activeGames);
    }
);

const getActiveClients = createSelector(
    [ getFirestoreData ],
    (data) => {
        if (!data) {
            return NOT_LOADED;
        }

        if (!isLoaded(data.activeClients)) {
            return NOT_LOADED;
        }

        return countify(data.activeClients);
    }
);

export const getStats = createSelector(
    [ getCompletedGames, getActiveGames, getActiveClients ],
    (completedGames, activeGames, activeClients) => {
        if (!isLoaded(completedGames, activeGames, activeClients)) {
            return NOT_LOADED;
        }

        return {
            completedGames,
            activeGames,
            activeClients
        };
    }
);