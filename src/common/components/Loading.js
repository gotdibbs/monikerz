import React from 'react';
import Spinner from './Spinner';

export default function Loading(props) {
    return (
        <div className='loading-cover loading-cover-center overflow-hidden' {...props}>
            <div className='row h-100 justify-content-center align-items-center'>
                <Spinner />
            </div>
        </div>
    );
}