<script lang="ts">
    import type {
        ProgramCourse,
        ProgramPeriod,
        ProgramYear,
    } from "../../model/course";
    import PeriodColumn from "./PeriodColumn.svelte";
    import type {PeriodDates} from "../../model/timetable";

    let {
        year,
        onAddCourse,
        onExistingCourse,
        periodDates,
        timeTableIds
    }: {
        year: ProgramYear;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;
        timeTableIds: Record<string, string>;
        periodDates: PeriodDates[];
    } = $props();
</script>

<div>
    <h2 class="text-3xl">År {year.year}</h2>
    <div class="flex mt-2 flex-wrap md:flex-nowrap">
        {#each year.periods as period}
            <PeriodColumn
                {period}
                {periodDates}
                {timeTableIds}
                onAddCourse={() => onAddCourse(period)}
                onExistingCourse={(c) => onExistingCourse(period, c)}
            />
        {/each}
    </div>
</div>
