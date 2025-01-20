<script>
    import CourseCell from "./CourseCell.svelte";
    import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";

    function onTimeTable(){}
</script>

<div class="flex-1 min-w-full md:min-w-0">
    <div class="flex justify-between px-4 border">
        <b>LP1</b>
        <button onclick={onTimeTable} class="flex gap-1 items-center text-gray-400">Schema
            <Fa icon={faArrowUpRightFromSquare}/>
        </button>
    </div>
    {#each Array(2) as _ }
        <CourseCell onClick={() => {}}>
            ok
        </CourseCell>
    {/each}
</div>
