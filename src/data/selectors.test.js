/* eslint-disable no-unused-labels */
import * as Selectors from './selectors';

jest.unmock('react-redux-firebase');

describe('getGame', () => {
    it('should return NOT_LOADED if one of the dependencies does not exits', () => {
        const selected = Selectors.getGame.resultFunc(null);
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return NOT_LOADED if one of the dependencies does not exits', () => {
        const selected = Selectors.getGame.resultFunc({
            games: Selectors.NOT_LOADED
        });
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return null if no game is found', () => {
        const selected = Selectors.getGame.resultFunc({
            games: {}
        });

        expect(selected).toBeNull();
    });

    it('should return only one game, sorted by ID', () => {
        const selected = Selectors.getGame.resultFunc({
            games: {
                '3': { test_id: 3 },
                '1': { test_id: 1 },
                '2': { test_id: 2 }
            }
        });
        
        expect(selected).toBeTruthy();
        expect(selected.id).toBe('1');
        // Triple check to make sure we're getting the right object body as well
        expect(selected.test_id).toBe(1);
    });
});

describe('getClients', () => {
    it('should return NOT_LOADED if one of the dependencies does not exits', () => {
        const selected = Selectors.getClients.resultFunc(null);
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return NOT_LOADED if one of the dependencies does not exits', () => {
        const selected = Selectors.getClients.resultFunc({
            clients: Selectors.NOT_LOADED
        });
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return null if no clients are found', () => {
        const selected = Selectors.getClients.resultFunc({
            clients: null
        });

        expect(selected).toBeNull();
    });

    it('should return all clients, sorted by ID', () => {
        const selected = Selectors.getClients.resultFunc({
            clients: {
                '3': { test_id: 3 },
                '1': { test_id: 1 },
                '2': { test_id: 2 }
            }
        });
        
        expect(selected).toBeTruthy();
        expect(selected.length).toBe(3);
        expect(selected[0]).toBeTruthy();
        expect(selected[0].test_id).toBe(1);
        expect(selected[selected.length - 1].test_id).toBe(3);
    });
});

describe('getGameState', () => {
    it('should return NOT_LOADED if games are not loaded', () => {
        const selected = Selectors.getGameMetadata.resultFunc(Selectors.NOT_LOADED, []);
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return NOT_LOADED if clients are not loaded', () => {
        const selected = Selectors.getGameMetadata.resultFunc({}, Selectors.NOT_LOADED);
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('handles nulls', () => {
        const selected = Selectors.getGameMetadata.resultFunc(null, null, null);
        expect(selected).toBeTruthy();
        expect(selected).not.toBe(Selectors.NOT_LOADED);
    });

    it('destructures game data appropriately', () => {
        const selected = Selectors.getGameMetadata.resultFunc(null, {
            test_prop1: true,
            test_prop2: true
        }, []);

        expect(selected).toBeTruthy();
        expect(selected.test_prop1).toBeTruthy();
        expect(selected.test_prop2).toBeTruthy();
    });

    it('should find me and my teammates', () => {
        const MY_ID = 'gubernator';
        const selected = Selectors.getGameMetadata.resultFunc(MY_ID, {}, [
            { id: MY_ID, team: 'blue' },
            { id: 'a', team: 'blue' },
            { id: 'b', team: 'red' }
        ]);

        expect(selected).toBeTruthy();
        expect(selected.me).toBeTruthy();
        expect(selected.me.id).toBe(MY_ID);
        expect(selected.teammates).toBeTruthy();
        expect(selected.teammates.length).toBe(2);
        expect(selected.teammates.filter(t => t.team === 'red').length).toBe(0);
    });

    it('should count teams correctly', () => {
        const selected = Selectors.getGameMetadata.resultFunc('a', {}, [
            { id: 'a', team: 'blue' },
            { id: 'b', team: 'blue' },
            { id: 'c', team: 'red' }
        ]);

        expect(selected).toBeTruthy();
        expect(selected.blueTeamCount).toBe(2);
        expect(selected.redTeamCount).toBe(1);
    });

    it('should find the leader', () => {
        const LEADER_ID = 'gubernator';
        const selected = Selectors.getGameMetadata.resultFunc('a', {}, [
            { id: 'a', team: 'blue' },
            { id: LEADER_ID, team: 'blue', isLeader: true },
            { id: 'b', team: 'red' }
        ]);

        expect(selected).toBeTruthy();
        expect(selected.leader).toBeTruthy();
        expect(selected.leader.id).toBe(LEADER_ID);
    });

    it('filters out inbound players from minimum count', () => {
        const selected = Selectors.getGameMetadata.resultFunc('a', {}, [
            { id: 'a', name: 'test', team: 'blue' },
            { id: 'b', name: 'b' },
            { id: 'c', team: 'red' },
            { id: 'd'}
        ]);

        expect(selected).toBeTruthy();
        expect(selected.hasMinimumPlayers).toBeFalsy();
    });
});

describe('getStats', () => {
    it('should return NOT_LOADED if something is not loaded', () => {
        let selected = Selectors.getStats.resultFunc(Selectors.NOT_LOADED, [], []);
        expect(selected).toBe(Selectors.NOT_LOADED);

        selected = Selectors.getGameMetadata.resultFunc([], Selectors.NOT_LOADED, []);
        expect(selected).toBe(Selectors.NOT_LOADED);

        selected = Selectors.getGameMetadata.resultFunc([], [], Selectors.NOT_LOADED);
        expect(selected).toBe(Selectors.NOT_LOADED);
    });

    it('should return an object of the right shape', () => {
        const selected = Selectors.getStats.resultFunc([], [], []);
        expect(selected).toBeTruthy();
        expect(selected).toHaveProperty('completedGames');
        expect(selected).toHaveProperty('activeGames');
        expect(selected).toHaveProperty('activeClients');
    });
});