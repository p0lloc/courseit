<script lang="ts">
    import type {
        Program,
        ProgramCourse,
        ProgramPeriod,
    } from "../../model/course";
    import Year from "./Year.svelte";
    import type {PeriodDates} from "../../model/timetable";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";

    let {
        program,

        onAddCourse,
        onExistingCourse,
        timeTableIds,
        periodDates,
        onSwitch
    }: {
        program: Program;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;

        timeTableIds: Record<string, string>;
        periodDates: PeriodDates[];
        onSwitch?: () => void
    } = $props();
</script>

<h2 class="text-4xl">{program.name}
    {#if program.master}
        <button class="ml-2 text-2xl" onclick={() => onSwitch?.()}>
            <Fa icon={faPenToSquare}/>
        </button>
    {/if}
</h2>
<div class="flex flex-col gap-4 mt-4">
    {#each program.years as year}
        <Year master={program.master} {timeTableIds} {periodDates} {year} {onAddCourse} {onExistingCourse}/>
    {/each}
</div>
