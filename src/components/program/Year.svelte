<script lang="ts">
    import type {
        ProgramCourse,
        ProgramPeriod,
        ProgramYear,
    } from "../../model/course";
    import PeriodColumn from "./PeriodColumn.svelte";
    import type {PeriodDates} from "../../model/timetable";
    import SelectMasterThesis from "./SelectMasterThesis.svelte";

    let selectedMasterThesis = $state(false);

    let {
        year,
        master,
        onAddCourse,
        onExistingCourse,
        periodDates,
        timeTableIds,

        extendedCourses
    }: {
        year: ProgramYear;
        master: boolean;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;
        timeTableIds: Record<string, string>;
        periodDates: PeriodDates[];

        extendedCourses: boolean;
    } = $props();

    function onMasterThesisSelected(c: ProgramCourse){
        for (let i = (4 - (c.info.credit / 15)); i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                // A thesis course always spans 15HP each
                year.periods[i].selectedCourses.push(c);
            }

            selectedMasterThesis = true;
        }
    }

    let isLastYearMaster = $derived(master && year.year === 2);
</script>

{#if !isLastYearMaster || selectedMasterThesis}
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
                        {extendedCourses}
                />
            {/each}
        </div>
    </div>
{:else}
    <SelectMasterThesis {year} onSelect={onMasterThesisSelected} />
{/if}
