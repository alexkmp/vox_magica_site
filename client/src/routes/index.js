import React from 'react';
import { Route, Switch } from 'react-router';

import Book from '../pages/Book';
import About from '../pages/About';
import Home from '../pages/Home';
import NavigationPage from '../pages/NavigationPage';

const routes = ( 
<div>
    <NavigationPage/>
    <Switch >
        <Route exact path = "/" component = {Home}/>
        <Route path = "/book" component = {Book}/>
        <Route path = "/about" component = {About}/>
    </Switch>
    </div>
);

export default routes;