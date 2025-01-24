<script lang="ts">
    import {formatDateYYYYMMDD} from "../../util/format";
    import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import type {ExamConflict} from "../../model/course";

    let {conflicts}: {conflicts: ExamConflict[]} = $props();

    let showConflicts = $state(false);
</script>

{#if conflicts.length > 0 }
    <button class="text-red-400 flex items-center gap-2" onclick={() => showConflicts = !showConflicts}>
        <Fa icon={faTriangleExclamation}/>
        Visa tentakrockar</button>
    {#if showConflicts}
        {#each conflicts as conflict }
            <p class="text-xs">{conflict.firstCourse} och {conflict.secondCourse} - {formatDateYYYYMMDD(conflict.date)}</p>
        {/each}
    {/if}
{/if}
