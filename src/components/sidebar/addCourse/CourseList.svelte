<script lang="ts">
	import type { ProgramCourse } from "../../../model/course";
	import CourseListButton from "./CourseListButton.svelte";

	let {
		courses,
		onClick,
	}: { courses: ProgramCourse[]; onClick: (course: ProgramCourse) => void } =
		$props();

	function caseInsensitiveMatch(first: string, second: string){
		return first.toLowerCase().includes(second.toLowerCase());
	}

	let searchPhrase = $state("");
	let result = $derived(courses.filter(c =>
		    caseInsensitiveMatch(c.name, searchPhrase)
			|| caseInsensitiveMatch(c.id, searchPhrase)));
</script>

<div class="flex flex-col gap-2">
	<input bind:value={searchPhrase} class="border mb-2 w-full p-2 text-xs" placeholder="Sök..." />
	{#each result as course (course.id)}
		<CourseListButton onClick={() => onClick(course)} {course} />
	{/each}
</div>
