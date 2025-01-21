<script lang="ts">
    import type {
        Program,
        ProgramCourse,
        ProgramPeriod,
    } from "../../model/course";
    import Year from "./Year.svelte";

    let {
        program,

        onAddCourse,
        onExistingCourse,
    }: {
        program: Program;

        onAddCourse: (period: ProgramPeriod) => void;
        onExistingCourse: (period: ProgramPeriod, c: ProgramCourse) => void;
    } = $props();
</script>

<h2 class="text-4xl">Informationsteknik</h2>
<div class="flex flex-col gap-4 mt-4">
    {#each program.years as year}
        <Year {year} {onAddCourse} {onExistingCourse} />
    {/each}
</div>
