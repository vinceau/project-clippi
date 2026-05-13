import React from "react";
import ReactDOM from "react-dom";
import App from './containers/App';

const rootEl = document.getElementById('root') as HTMLElement;

const render = (Component: any) =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(<Component />, rootEl);

render(App);

// calling IPC exposed from preload script
window.electron?.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron?.ipcRenderer.sendMessage('ipc-example', ['ping']);
