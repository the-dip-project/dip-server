import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import WebFont from 'webfontloader';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import store from './store/store';

WebFont.load({
  google: {
    families: ['Roboto:300,400,500'],
  },
});

render(
  <React.StrictMode>
    <CssBaseline />
    <Provider store={store}>
      <ThemeProvider theme={createTheme()}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
