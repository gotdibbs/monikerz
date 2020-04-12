import React from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Page from 'common/components/Page';

export default function Rules() {
    const history = useHistory();

    function back(e) {
        e.preventDefault();
        
        history.push('/');
    }

    return (
        <Page bodyClassName='rules' title='Rules'>
            <main className='card flex-column my-sm-4'>
                <div className='card-header'>
                    <a href='#' className='card-back' onClick={back}>
                        <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                        &nbsp;
                        back
                    </a>
                </div>

                <div className='card-body'>
                    <div>
                        <h1 className='text-center'>Getting Started</h1>
                        <div className='dashed-line'></div>
                        <p>Monikerz only takes about 5-10 minutes to learn. One person creates the game, then shares out the code for others to join in.</p>
                        <p>You'll all be dealt a set of cards. You'll each then choose 5-7 of those cards (depending on how many players joined) to put into the game deck.</p>
                        <p>Once everyone's all in, just hit START GAME. The starting team will be randomly selected.</p>
                    </div>

                    <hr />

                    <div>
                        <h2 className='text-center'>How to play</h2>
                        <p>In each turn, the clue giver has 60 seconds to get their team to guess as many names as possible from the deck by giving clues about the person’s identity. There's no limit to the number of guesses. Skipping is allowed and highly encouraged in all rounds.</p>
                        <p>Teams take turns giving clues. Each player should take a turn giving clues before any teammates repeat.</p>
                        <p>A round ends when all cards from the deck have been guessed correctly.</p>
                    </div>

                    <hr />

                    <div>
                        <h2 className='text-center'>Rules for each round</h2>
                        <p>Monikerz has 3 rounds. Each has a restriction on how players are allowed to give clues:</p>
                        <ul>
                            <li>ROUND 1: You can use any words, sounds, or gestures except the name itself, including the clue text on the card. If you say any part of the name, you have to skip that card this turn.</li>
                            <li>ROUND 2: Use only one word, which can be anything except the name itself. You can repeat that word as many times as you like, but no sounds or gestures.</li>
                            <li>ROUND 3: Just charades. No words. Sound effects are OK.</li>
                        </ul>
                    </div>

                    <hr />

                    <div>
                        <h2 className='text-center'>Ending the game</h2>
                        <p>The team with the highest total score after 3 rounds wins. But feel free not to keep score at all. It’s fun to play competitively, but not necessary with the right group.</p>
                        <p><b>Monikerz is available for free under a Creative Commons BY-NC-SA 4.0 license.</b></p>
                    </div>
                </div>

                <div className='card-footer'>
                    <a href='#' className='card-back' onClick={back}>
                        <FontAwesomeIcon icon={['fas', 'arrow-left']} />
                        &nbsp;
                        back
                    </a>
                </div>
            </main>
        </Page>
    );
}