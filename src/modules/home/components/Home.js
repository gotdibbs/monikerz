import React from 'react';
import { useHistory } from 'react-router-dom';

import Page from 'common/components/Page';

export default function Home() {
    const history = useHistory();

    function start() {
        history.push('/start');
    }

    function read() {
        history.push('/rules');
    }

    return (
        <Page appClassName='overflow-hidden' bodyClassName=''>
            <div className='jumbotron jumbotron-fluid bg-primary mt-5 text-center'>
                <div className='container col-12 col-md-6'>
                    <h1 className='display-5 text-light'>All the laughs of the card game, but with less germs</h1>
                    <hr className='bg-light w-10' />
                    <p className='lead text-light'>Monikerz is a party game that is similar to Celebrity or Charades. Teams play against each other by trying to guess as many names as possible before time runs out.</p>

                    <button className='btn btn-lg btn-outline-light m-2' onClick={read}>Read the rules</button>
                    <span className='m-2 text-light d-none d-lg-inline'>- or -</span>
                    <button className='btn btn-lg btn-outline-light m-2' onClick={start}>Join in on the fun!</button>
                </div>
            </div>
            <div className='d-flex justify-content-center align-items-start flex-row flex-wrap'>
                <img src='../../../../assets/preview1.jpg' className='preview-image' />
                <img src='../../../../assets/preview2.jpg' className='preview-image' />
            </div>
        </Page>
    );
}