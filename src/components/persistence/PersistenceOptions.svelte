<script lang="ts">
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faFileImport, faFloppyDisk} from "@fortawesome/free-solid-svg-icons";
    import {savedProgramPlans} from "../../main";
    import type {Program} from "../../model/course";

    const CREATE_ID = "CREATE";
    let planId = $state(CREATE_ID);

    let {onLoadPlan, mainProgram, master}: {
        onLoadPlan: (id: string) => void,
        mainProgram: Program,
        master: Program | null
    } = $props();

    function load() {
        if (planId == CREATE_ID) return;

        onLoadPlan(planId);
    }

    function create() {
        let name = prompt("Namn?");
        if (name == null)
            return;

        let newPlan = savedProgramPlans.create(name, mainProgram, master);
        planId = newPlan.id;
    }

    function save() {
        if (planId == CREATE_ID) {
            create();
        } else {
            savedProgramPlans.update(planId, mainProgram, master);
        }
    }
</script>


<div class="flex gap-2 items-center">
    <select bind:value={planId}>
        <option value={CREATE_ID}>Skapa ny plan</option>
        {#each $savedProgramPlans as plan }
            <option value={plan.id}>{plan.name}</option>
        {/each}
    </select>
    <button class="flex gap-2 items-center" onclick={save}>
        Spara
        <Fa icon={faFloppyDisk}/>
    </button>
    <button class="flex gap-2 items-center" onclick={load}>
        Ladda
        <Fa icon={faFileImport}/>
    </button>
</div>

<style>
    select, button {
        @apply border bg-white px-2 py-1 rounded-md h-8;
    }
</style>
