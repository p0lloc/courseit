<script lang="ts">
    import type {ProgramCourse, ProgramYear} from "../../model/course";

    let {year, onSelect}: {year: ProgramYear, onSelect: (c: ProgramCourse) => void} = $props();

    function getThesisCourses(year: ProgramYear): ProgramCourse[] {
        let courses: Record<string, ProgramCourse> = {};
        for (let period of year.periods) {
            for (let course of period.courses) {
                if (course.moments.some(m => m.rule == "X")) {
                    courses[course.id] = course;
                }
            }
        }

        return Object.values(courses);
    }
</script>
<h2 class="text-3xl">Examensarbete</h2>
<div class="flex flex-col gap-2">
    {#each getThesisCourses(year) as course}
        <button class="block w-full border p-2"
                onclick={() => onSelect(course)}>{course.name} ({course.info.credit}HP)</button>
    {/each}
</div>
