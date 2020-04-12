import React from 'react';

export default function Card({ cardIndex }) {
    return <div data-testid='card'>{cardIndex}</div>;
}