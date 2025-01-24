<script lang="ts">
    import {formatDateYYYYMMDD} from "../../util/format";
    import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";

    let {conflicts}: {conflicts: Date[]} = $props();

    let showConflicts = $state(false);
</script>

{#if conflicts.length > 0 }
    <button class="text-red-400 flex items-center gap-2" onclick={() => showConflicts = !showConflicts}>
        <Fa icon={faTriangleExclamation}/>
        Visa schemakrockar</button>
    {#if showConflicts}
        {#each conflicts as conflict }
            <p class="text-xs">{formatDateYYYYMMDD(conflict)}</p>
        {/each}
    {/if}
{/if}
