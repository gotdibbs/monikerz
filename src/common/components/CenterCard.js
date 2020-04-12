import React from 'react';

export default function CenterCard({ children, className }) {
    return (
        <article className={['card-center', className].join(' ')}>
            { children }
        </article>
    );
}