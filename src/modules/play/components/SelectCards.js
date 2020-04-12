import React, { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import * as Fathom from 'fathom-client';

import Button from 'common/components/Button';
import Card from './Card';

export default function SelectCards({ gameState, next }) {
    const firestore = useFirestore();

    const [cardIndex, setCardIndex] = useState(0);
    const [selectedCards, setSelectedCards] = useState([]);
    const [discardedCards, setDiscardedCards] = useState([]);
    const [isIntroDismissed, setIsIntroDismissed] = useState(false);

    const card = gameState.me?.cards[cardIndex];
    const isSelected = selectedCards.includes(card);
    const isDiscarded = discardedCards.includes(card);
    const numSelected = selectedCards.length;
    const numOptions = gameState.me?.cards.length;
    const maxSelectable = parseInt(numOptions / 2, 10) || 5;

    function keep() {
        if (numSelected === maxSelectable) {
            return;
        }

        if (!isSelected) {
            setSelectedCards([
                ...selectedCards,
                card
            ]);
        }
        if (isDiscarded) {
            setDiscardedCards([
                ...discardedCards.filter(c => c !== card)
            ]);
        }

        cycle();
    }

    function discard() {
        if (isSelected) {
            setSelectedCards([
                ...selectedCards.filter(c => c !== card) 
            ]);
        }
        if (!isDiscarded) {
            setDiscardedCards([
                ...discardedCards,
                card
            ]);
        }

        cycle();
    }

    function cycle(next = true) {
        setCardIndex((cardIndex + (next ? 1 : -1) + numOptions) % numOptions);
    }

    function onCardClick({ pageX, currentTarget }) {
        const targetBounds = currentTarget.getBoundingClientRect();

        // Go to the next card if tapping on the right
        cycle(pageX >= targetBounds.right - (targetBounds.width / 2));
    }

    async function start() {
        let update = {
            ...gameState.me,
            selected_cards: selectedCards
        };

        await firestore.collection('clients').doc(gameState.me.id).update(update);

        if (gameState.me?.isLeader) {
            Fathom.trackGoal('W7KHHCCG', 0);
        }

        next(!gameState.isReady ? 'select_wait' : gameState.isMyTurn ? 'select_start' : 'select_view');
    }

    function dismissIntro() {
        setIsIntroDismissed(true);
    }

    return (
        <main className='card flex-column' data-testid='SelectCards'>
            <div className='card-body d-flex flex-column align-items-center mb-0'>
                <div className='select-cards-intro' style={{ display: isIntroDismissed ? 'none' : 'flex' }}>
                    <div>
                        <p>
                            Hey there! You're about to see a stack of {numOptions} cards, just for you. I need you to pick exactly {maxSelectable} of them to put into the game.
                        </p>
                        <p>
                            Choose whichever names you know, like, think are funny, or will stump your sworn enemy.
                        </p>
                        <p>
                            Use the <span className='badge badge-pill badge-success'>Keep</span> button to save a card, or tap the card / press the <span className='badge badge-pill badge-secondary'>Skip</span> button to cycle through the available options.
                        </p>
                        <p>
                            When you're all done selecting cards, press <span className='badge badge-pill badge-primary'>I'm Ready!</span>. Feel like you've got it?
                        </p>
                        <hr />
                        <p className='text-center'>
                            <Button className='btn btn-lg btn-primary' onClick={dismissIntro}>Choose Cards</Button>
                        </p>
                    </div>
                </div>
                <Card border={isSelected ? '1px solid #28a745' : isDiscarded ? '1px solid #dc3545' : '1px solid transparent'}
                    hints={{
                        topRight: `${cardIndex + 1} / ${numOptions}`,
                        bottomLeft: 'prev',
                        bottomRight: 'next'
                    }}
                    isVisible={isIntroDismissed}
                    cardIndex={card}
                    onClick={onCardClick} />

                <div className='text-center mt-4 w-100'>
                    <button className='btn btn-lg btn-secondary mr-5 w-40' onClick={discard}>Skip</button>
                    <button className='btn btn-lg btn-success w-40'
                        onClick={keep}
                        disabled={numSelected === maxSelectable}
                        data-testid='select-keep'>Keep</button>
                </div>
            </div>

            <div className='card-footer text-center'>
                { numSelected === maxSelectable ? (
                    <Button className='btn btn-lg btn-primary w-100'
                        onClick={start}
                        async
                        data-testid='select-ready'>I'm Ready!</Button> 
                ) : (
                    <span className='text-muted'>Select <b>Keep</b> for <b>{maxSelectable - numSelected}</b> more cards.</span>
                ) }
            </div>
        </main>
    );
}