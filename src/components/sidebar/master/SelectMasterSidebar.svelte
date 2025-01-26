<script lang="ts">
    import {
        type SidebarAction,
        type SelectMasterAction,
    } from "../../../model/sidebar";
    import type {Program, ProgramCourse} from "../../../model/course";
    import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import {coursePlanUrl, masterProgramUrl} from "../../../services/external";
    import MasterProgramInfo from "./MasterProgramInfo.svelte";

    let {action}: { action: SidebarAction } = $props();
    let value = $derived<SelectMasterAction>(
        action.value as SelectMasterAction,
    );

    function showProgram(program: Program){
        selectedProgram = program;
    }

    function selectProgram(){
        if(selectedProgram == null) return;

        value.onProgramSelected(selectedProgram);
    }

    function back(){
        selectedProgram = null;
    }

    let selectedProgram = $state<Program | null>(null);
    let info = $derived(value.info.find(p => p.id == selectedProgram?.id));
</script>


{#if selectedProgram != null && info != null}
    <button onclick={back}>
        <Fa icon={faArrowLeft} />
    </button>

    <MasterProgramInfo program={info} />

    <button
            class="p-2 bg-blue-500 text-white w-full mt-4 rounded-md hover:bg-blue-600"
            onclick={selectProgram}>Välj</button
    >
{:else}
    <h2 class="text-2xl mb-2">Välj master</h2>
    <div class="flex flex-col gap-2 flex-wrap">
        {#each value.programs as program}
            <button class="text-xs p-2 border w-full font-bold text-wrap"
                    onclick={() => showProgram(program)}>{program.master?.name ?? ""}</button>
        {/each}
    </div>
{/if}
