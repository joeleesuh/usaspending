import 'core-js';
import 'helpers/rafPolyfill';

import React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';

import AppContainer from 'containers/AppContainer';
import registerIcons from './registerIcons';

registerIcons();

const appDiv = document.getElementById('app');
const App = render(
    <AppContainer />,
    appDiv
);

export default hot(module)(App);
