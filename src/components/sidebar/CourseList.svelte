<script lang="ts">
	import type { ProgramCourse } from "../../model/course";
	import CourseListButton from "./CourseListButton.svelte";

	let {
		courses,
		onClick,
	}: { courses: ProgramCourse[]; onClick: (course: ProgramCourse) => void } =
		$props();
</script>

<div class="flex flex-col gap-2">
	{#each courses as course (course.id)}
		<CourseListButton onClick={() => onClick(course)} {course} />
	{/each}
</div>
