import React from 'react';
import ReactDOM from 'react-dom/client';
import { ServicesContext, servicesContextDefaultValue } from './contexts/services.context';
import './index.css';
import { Root } from './pages/Root/Root';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ServicesContext.Provider value={servicesContextDefaultValue}>
      <Root />
    </ServicesContext.Provider>
  </React.StrictMode>,
);
