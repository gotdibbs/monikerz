import React from 'react';
import classNames from 'classnames';

import Cards from 'data/cards';

const COLOR_MAP = {
    1: 'rgba(76, 189, 159, 1)',
    2: '#00B4EF',
    3: '#866AAD',
    4: 'rgba(239, 83, 63, 1)'
};

export default function Card({
    border = '1px solid transparent',
    cardIndex,
    hints,
    isVisible = true,
    onClick = () => {}
}) {
    const card = Cards[cardIndex];
    const containerClassName = classNames('playingcard-container disable-select', {
        'playingcard-animate': isVisible
    });

    if (!card) {
        return null;
    }

    return (
        <div className={containerClassName}
            style={{ border }}
            onClick={onClick}>
            <h1 className='playingcard-title'>{card.name}</h1>
            <p className='playingcard-description'>{card.description}</p>
            <div className='dashed-line' />

            <h3 className='playingcard-category' style={{ color: COLOR_MAP[card.points] }}>
                {card.category}
            </h3>

            <div className='playingcard-circle' style={{ backgroundColor: COLOR_MAP[card.points] }}>
                <h1 className='playingcard-points'>{card.points}</h1>
            </div>

            {hints?.topRight ? (
                <div className='top-right-child text-muted'>
                    {hints.topRight}
                </div>
            ) : null}
            {hints?.bottomLeft ? (
                <div className='bottom-left-child hint text-muted'>
                    {hints.bottomLeft}
                </div>
            ) : null}
            {hints?.bottomRight ? (
                <div className='bottom-right-child hint text-muted'>
                    {hints.bottomRight}
                </div>
            ) : null}
        </div>
    );
}