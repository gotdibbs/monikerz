import React from 'react';

export default function Cleaner({ config }) {
    return (
        <div className='card mx-4 mt-0'>
            <div className='card-header'>
                <h4>{config.title}</h4>
            </div>
            <div className='card-body'>
                <p className='mb-0'>{config.description}</p>
            </div>
            <hr />
            <div className='card-body text-center'>
                <button className='btn btn-large btn-danger w-100' 
                    disabled={config.isBusy}
                    onClick={config.clean}>
                    {config.isBusy ? <span className='spinner-border spinner-border-sm mr-1'></span> : null}
                    {config.isBusy ? 'Working...' : 'Run'}
                </button>
            </div>
        </div>
    );
}