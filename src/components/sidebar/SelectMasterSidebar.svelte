<script lang="ts">
    import {
        type SidebarAction,
        type SelectMasterAction,
    } from "../../model/sidebar";

    let {action}: { action: SidebarAction } = $props();
    let value = $derived<SelectMasterAction>(
        action.value as SelectMasterAction,
    );
</script>


<h2 class="text-2xl mb-2">Välj master</h2>
{#each value.programs as program}
    <button class="text-xs p-2 border w-full" onclick={() => value.onProgramSelected(program)}>{program.name}</button>
{/each}
