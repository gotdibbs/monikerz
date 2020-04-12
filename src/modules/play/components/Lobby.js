import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'common/components/Button';
import Cards from 'data/cards';

export default function Lobby({ gameState, next }) {
    const firestore = useFirestore();

    async function back(e) {
        e.preventDefault();

        await firestore.collection('clients').doc(gameState.me.id).set({
            ...gameState.me,
            team: null
        });

        next('back');
    }

    async function deal() {
        if (!gameState.me?.isLeader) {
            return;
        }

        const deck = [...Array(Cards.length).keys()]
            .map((_, index) => index)
            .sort(_ => Math.random() - 0.5);

        const batch = firestore.batch();

        let redTeamOrder= 0,
            blueTeamOrder = 0,
            firstBlue,
            firstRed;

        gameState.clients.map(client => {
            if (!client.team || !client.name) {
                // Auto purge clients who aren't ready / duplicates
                batch.delete(firestore.collection('clients').doc(client.id));
                return;
            }
            
            const order = client.team === 'red' ?
                redTeamOrder++ : blueTeamOrder++;

            if (order === 0 && client.team === 'red') {
                firstRed = client.id;
            }
            else if (order === 0) {
                firstBlue = client.id;
            }

            batch.update(firestore.collection('clients').doc(client.id), {
                order,
                cards: deck.splice(0, gameState.playerCount <= 4 ? 15 : 10)
            });
        });

        const turn = Math.random() > 0.5 ? firstBlue : firstRed;

        batch.update(firestore.collection('games').doc(gameState.id), {
            gameId: gameState.gameId,
            status: 'started',
            turn
        });

        await batch.commit();

        selectCards();
    }

    function selectCards() {
        next('ready');
    }

    async function share(e) {
        e.preventDefault();

        const target = e.currentTarget;

        let link = null;

        try {
            const body = JSON.stringify({
                dynamicLinkInfo: {
                    domainUriPrefix: 'https://monikerz.page.link',
                    link: link,
                    socialMetaTagInfo: {
                        socialTitle: 'Play Monikerz',
                        socialDescription: 'You\'re invited to join in on the fun!',
                        socialImageLink: 'https://monikerz.web.app/assets/preview1.jpg',
                    },
                },
                suffix: { option: 'SHORT'}
            });

            const response = await fetch(
                'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' + process.env.FIREBASE_API_KEY, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body
                });

            link = response.shortLink;

            console.log(response);
        }
        catch {}

        link = link || `${document.location.origin}/join/${gameState.gameId}`;

        if (navigator?.share) {
            return navigator.share({
                title: 'Come play Monikerz!',
                url: link
            });
        }

        // Let desktop user's know something actually happened
        const b = target?.querySelector('b'),
            originalText = b.innerText;
        b.innerText = 'copied!';
        setTimeout(() => {
            b.innerText = originalText;
        }, 800);

        navigator.clipboard.writeText(link);
    }

    return (
        <main className='card flex-column' data-testid='Lobby'>
            <div className='card-header'>
                {gameState.status !== 'started' ? (
                    <a href='#' className='card-back' onClick={back} data-testid='lobby-back'>
                        <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                        &nbsp;
                        Change team or name
                    </a>
                ) : null}
            </div>

            <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                    <h5 className='my-2'>Game Code&nbsp;
                        <a href='#' className='gamecode' onClick={share}>
                            <FontAwesomeIcon icon={['fas', 'share-square']} className='mx-1' />
                            <b>{gameState.gameId}</b>
                        </a>
                    </h5>
                </li>

                <li className='list-group-item'>
                    <h5 className='d-flex align-items-center'>
                        Blue Team
                        <span className='badge badge-pill badge-primary ml-2'>{gameState.blueTeamCount}</span>
                    </h5>
                    <div>
                        {gameState.blueTeam.filter(c => !!c.name).map(c => c.name).join(', ')}
                    </div>
                </li>

                <li className='list-group-item'>
                    <h5 className='d-flex align-items-center'>
                        Red Team
                        <span className='badge badge-pill badge-danger ml-2'>{gameState.redTeamCount}</span>
                    </h5>
                    <div>
                        {gameState.redTeam.filter(c => !!c.name).map(c => c.name).join(', ')}
                    </div>
                </li>
            </ul>

            <div className='card-footer'>
                { gameState.me?.isLeader && gameState.hasMinimumPlayers ? (
                    <span>
                        <Button className='btn btn-primary' onClick={deal} async data-testid='deal-cards'>Deal Cards</Button>
                        &nbsp; <span className='text-muted'>once everyone is in.</span>
                    </span>
                ) : !gameState.hasMinimumPlayers ? (
                    <span className='ellipsis'>Waiting for a minimum of two players (though we recommend four), with one on each team</span> 
                ) : !gameState.me?.isLeader ? (
                    <span className='text-info ellipsis'>Waiting for <b>{gameState.leader?.name}</b> to start the game</span>
                ) : null }
            </div>
        </main>
    );
}