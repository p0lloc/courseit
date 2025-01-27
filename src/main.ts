import {mount} from 'svelte'
import './app.css'
import App from './App.svelte'
import {loadAppData} from './services/data'
import {ProgramPlanStore} from "./services/persistence";

export const savedProgramPlans = new ProgramPlanStore();

async function loadApp() {
  savedProgramPlans.load();
  return mount(App, {
    target: document.getElementById('app')!,
    props: {
      appData: await loadAppData()
    }
  });
}

export default loadApp();
