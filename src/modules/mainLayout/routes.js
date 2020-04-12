import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Home, Rules, Start } from '../home';
import { AutoJoin } from '../join';
import { PlayLayout } from '../play';
import { GameOverLayout } from '../gameover';
import { Maintenance } from '../maintenance';

export default (
    <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/rules" component={ Rules } />
        <Route exact path="/start" component={ Start } />
        <Route path="/join/:gameId" component={ AutoJoin } />
        <Route path="/play/:gameId/:clientId" component={ PlayLayout } />
        <Route path="/gameover/:gameId/:bluePoints/:redPoints" component={ GameOverLayout } />
        <Route path="/maint/:runId" component={ Maintenance } />
    </Switch>
);