<script lang="ts">
    import type {
        ProgramCourse,
        ProgramPeriod,
        ProgramYear,
    } from "../../model/course";
    import PeriodColumn from "./PeriodColumn.svelte";

    let {
        year,
        onAddCourse,
        onExistingCourse,
    }: {
        year: ProgramYear;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;
    } = $props();
</script>

<div>
    <h2 class="text-3xl">År {year.year}</h2>
    <div class="flex mt-2 flex-wrap md:flex-nowrap">
        {#each year.periods as period}
            <PeriodColumn
                {period}
                onAddCourse={() => onAddCourse(period)}
                onExistingCourse={(c) => onExistingCourse(period, c)}
            />
        {/each}
    </div>
</div>
