<script lang="ts">
    import type {Course} from "../../model/course";
    import {coursePlanUrl, examStatisticsUrl, syllabusUrl} from "../../services/external";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
    import {getMaxStudents} from "../../services/requirements";

    let {course}: { course: Course } = $props();

    let maxStudents = $derived(getMaxStudents(course));
</script>

<a target="_blank" href={coursePlanUrl(course.id)} class="text-2xl block mb-2 max-w-[93%]">{course.name} ({course.credit} HP)</a>
<div class="flex items-center gap-2">
    <a target="_blank" class="flex items-center gap-2" href={syllabusUrl(course)}>
        Kurshemsida
        <Fa icon={faArrowUpRightFromSquare}/>
    </a>
    <a target="_blank" class="flex items-center gap-2" href={examStatisticsUrl(course.id)}>
        Andel
        godkända: {Math.round(course.passRate * 100)}
        %
        <Fa icon={faArrowUpRightFromSquare}/>
    </a>
</div>

{#each maxStudents as count}
    <p>Max antal studenter: {count}</p>
{/each}

<h2 class="text-xl mt-2">Syfte</h2>
<p class="text-xs">{@html course.purpose}</p>

<h2 class="text-xl mt-2">Huvudområde</h2>
<h2>{course.mainSubjects.join(", ")}</h2>

{#if course.prerequisites !== ""}
    <h2 class="text-xl mt-2">Förkunskaper</h2>
    <h2>{@html course.prerequisites}</h2>
{/if}

<h2 class="text-xl mt-2">Särskild behörighet</h2>
<h2>{@html course.specificRequirements}</h2>

<h2 class="text-xl mt-2">Litteratur</h2>
<h2>{@html course.litterature}</h2>
