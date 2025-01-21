import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { loadAppData } from './services/data'

const app = mount(App, {
  target: document.getElementById('app')!,
  props: {
    appData: await loadAppData()
  }
})

export default app
