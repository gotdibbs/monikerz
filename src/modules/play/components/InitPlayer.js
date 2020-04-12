import React from 'react';
import { useForm } from 'react-hook-form';
import { useFirestore } from 'react-redux-firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'common/components/Button';

export default function InitPlayer({ gameState, next }) {
    const firestore = useFirestore();
    const { formState, handleSubmit, register } = useForm({
        defaultValues: {
            name: gameState?.me?.name,
            team: gameState.redTeamCount > gameState.blueTeamCount ?
                'blue' : gameState.blueTeamCount > gameState.redTeamCount ?
                    'red' : null
        }
    });

    async function updatePlayer(values) {
        await firestore.collection('clients').doc(gameState.me.id).update({
            ...values
        });

        next('setup_complete');
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
        <main className='card flex-column' data-testid='InitPlayer'>
            <div className='card-header'>
                <h5 className='mb-0'>Game Code&nbsp;
                    <a href='#' onClick={share}>
                        <FontAwesomeIcon icon={['fas', 'share-square']} className='mx-1' />
                        <b>{gameState.gameId}</b>
                    </a>
                </h5>
            </div>
            <div className='card-body'>
                <p>Hey there! I ... don't quite recognize you. What should I call you? Oh and which team do you want to be on?</p>

                <hr />

                <form onSubmit={handleSubmit(updatePlayer)} data-testid='player-form'>
                    <div className='form-group'>
                        <label htmlFor='name'>Nickname</label>
                        <input type='text'
                            id='name'
                            name='name'
                            required
                            maxLength={15}
                            autoFocus
                            className='form-control form-control-lg'
                            data-testid='nickname'
                            ref={register({ required: 'Required' })} />
                    </div>

                    <div className='form-group'>
                        <div className='form-check team-check'>
                            <input className='form-check-input' 
                                type='radio'
                                name='team'
                                id='blue'
                                value='blue'
                                data-testid='blue-team'
                                ref={register({ required: 'Required' })} />
                            <label className='form-check-label' htmlFor='blue'>
                                Blue Team
                                <span className='badge badge-pill badge-primary ml-2'>{gameState.blueTeamCount} members</span>
                                {gameState.blueTeamCount > 0 ? (
                                    <small className='form-text text-muted'>
                                        Team Members: <b>{gameState.blueTeam.map(p => p.name).join(', ')}</b>
                                    </small>
                                ) : null}
                            </label>
                        </div>
                        <div className='form-check team-check'>
                            <input className='form-check-input'
                                type='radio'
                                name='team'
                                id='red'
                                value='red'
                                data-testid='red-team'
                                ref={register({ required: 'Required' })} />
                            <label className='form-check-label' htmlFor='red'>
                                Red Team
                                <span className='badge badge-pill badge-danger ml-2'>{gameState.redTeamCount} members</span>
                                {gameState.redTeamCount > 0 ? (
                                    <small className='form-text text-muted'>
                                    Team Members: <b>{gameState.redTeam.map(p => p.name).join(', ')}</b>
                                    </small>
                                ) : null}
                            </label>
                        </div>
                    </div>

                    <Button type='submit' className='btn btn-primary btn-lg' busy={formState.isSubmitting} async>Submit</Button>
                </form>
            </div>
        </main>
    );
}