import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from "../redux/rootReducer";
import App from '../components/App';
import { BrowserRouter }  from "react-router-dom";
import { getPreloadedState } from "../helpers/preloadedState";

const preloadedState = getPreloadedState();

const clientStore = configureStore({
    reducer: rootReducer,
    preloadedState,
});

hydrateRoot(
    document.getElementById('root'),
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={clientStore}>
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
);
