import {mount} from 'svelte'
import './app.css'
import App from './App.svelte'
import {loadAppData} from './services/data'

async function loadApp() {
  return mount(App, {
    target: document.getElementById('app')!,
    props: {
      appData: await loadAppData()
    }
  });
}

export default loadApp();
