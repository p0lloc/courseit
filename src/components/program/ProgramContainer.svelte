<script lang="ts">
    import type {
        Program,
        ProgramCourse,
        ProgramPeriod,
    } from "../../model/course";
    import Year from "./Year.svelte";
    import type {PeriodDates} from "../../model/timetable";

    let {
        program,

        onAddCourse,
        onExistingCourse,
        timeTableIds,
        periodDates
    }: {
        program: Program;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;

        timeTableIds: Record<string, string>;
        periodDates: PeriodDates[];
    } = $props();
</script>

<h2 class="text-4xl">Informationsteknik</h2>
<div class="flex flex-col gap-4 mt-4">
    {#each program.years as year}
        <Year {timeTableIds} {periodDates} {year} {onAddCourse} {onExistingCourse} />
    {/each}
</div>
