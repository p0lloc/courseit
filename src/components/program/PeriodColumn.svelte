<script lang="ts">
    import CourseCell from "./CourseCell.svelte";
    import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import type { ProgramCourse, ProgramPeriod } from "../../model/course";
    import type { PeriodDates } from "../../model/timetable";
    import { generateTimetableUrl } from "../../services/timetable-link";

    const MIN_COURSES = 2;

    let {
        period,
        onAddCourse,
        onExistingCourse,
        periodDates,
        timeTableIds,
    }: {
        period: ProgramPeriod;
        onAddCourse: () => void;
        onExistingCourse: (c: ProgramCourse) => void;
        timeTableIds: Record<string, string>;
        periodDates: PeriodDates[];
    } = $props();

    function onTimeTable() {
        let dates = periodDates.find((p) => p.id == period.id);
        if (dates == null) return;

        let courseIds = period.selectedCourses.map((v) => timeTableIds[v.id]);
        window.open(
            generateTimetableUrl(courseIds, dates.from, dates.to),
            "_blank",
        );
    }
</script>

<div class="flex-1 min-w-full md:min-w-0">
    <div class="flex justify-between px-4 border">
        <b>{period.id}</b>
        <button
            onclick={onTimeTable}
            class="flex gap-1 items-center text-gray-400"
            >Schema
            <Fa icon={faArrowUpRightFromSquare} />
        </button>
    </div>
    {#each Array(Math.max(MIN_COURSES, period.selectedCourses.length)) as _, i}
        {#if i < period.selectedCourses.length}
            <CourseCell
                onClick={() => onExistingCourse(period.selectedCourses[i])}
            >
                {period.selectedCourses[i].name}
            </CourseCell>
        {:else}
            <CourseCell onClick={() => onAddCourse()}>+</CourseCell>
        {/if}
    {/each}
</div>
