<script lang="ts">
	import type { Course } from "../../model/course";

	let { course }: { course: Course } = $props();
</script>

<h2 class="text-2xl">{course.name} ({course.credit} HP)</h2>
<p>Andel godkända: {Math.round(course.passRate * 100)}%</p>
<h2 class="text-xl mt-2">Syfte</h2>
<p class="text-xs">{@html course.purpose}</p>
<h2 class="text-xl mt-2">Huvudområde</h2>
<h2>{course.mainSubjects.join(", ")}</h2>
{#if course.prerequisites != ""}
	<h2 class="text-xl mt-2">Förkunskaper</h2>
	<h2>{@html course.prerequisites}</h2>
{/if}
<h2 class="text-xl mt-2">Särskild behörighet</h2>
<h2>{@html course.specificRequirements}</h2>
<h2 class="text-xl mt-2">Litteratur</h2>
<h2>{@html course.litterature}</h2>
