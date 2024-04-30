import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import App from '../src/components/App';
import rootReducer from "../src/redux/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { getApiData } from "./helper";
import fs from 'fs';

const store = configureStore({
    reducer: rootReducer,
});

const app = express();
const PORT = process.env.PORT || 9200;
app.use(express.static('build', { index: false }));

const templatesDir = __dirname + '/';

app.get('*', async (req, res) => {
    try {
        const payload = {};
        const metaData = {
            title: 'Users',
            description: 'About users'
        }
        const responseData = await getApiData(req.url === '/' ? '/users' : req.url);
        payload.list = responseData;

        if (req.url !== '/') {
            const usersListResponse = await getApiData('/users');
            const userData = usersListResponse.find((user) => user.id === responseData[0].userId);
            const urlTitle = req.url.split('/')[3];

            metaData.title = [userData.name, urlTitle].join(' ');
            metaData.description = ['About', userData.name, urlTitle].join(' ');
            payload.title = [userData.name, '-', urlTitle].join(' ');
            payload.usersList = usersListResponse;
        }

        store.dispatch({ type: 'ADD', payload });

        fs.readFile(templatesDir + 'index.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.html file:', err);
                return res.status(500).send('Server error');
            }

            const appMarkup = ReactDOMServer.renderToString(
                <StaticRouter location={req.url} context={{}}>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </StaticRouter>
            );

            const finalHtml = data
                .replace('{{TITLE}}', metaData.title)
                .replace('{{DESCRIPTION}}', metaData.description)
                .replace('{{SSR_CONTENT}}', appMarkup)
                .replace('{{PRELOADED_STATE}}', `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())}</script>`);

            res.status(200).send(finalHtml);
        });
    } catch (e) {
        console.error('Server error', e);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
