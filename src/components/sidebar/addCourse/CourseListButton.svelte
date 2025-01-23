<script lang="ts">
    import type {ProgramCourse} from "../../../model/course";
    import {isITCourse} from "../../../services/requirements";

    let {
        course,

        onClick,
    }: { course: ProgramCourse; onClick: () => void } = $props();
</script>

<button class="border w-full p-2 text-xs hover:bg-gray-100" onclick={onClick}>
    <p class="font-bold">{course.name}</p>
    <div>
        {course.info.credit} HP
        {#if course.nature}
            (Natur)
        {/if}
        {#if course.mts}
            (MTS)
        {/if}
        {#if isITCourse(course.info)}
            (IT)
        {/if}
    </div>
</button>
