<script lang="ts">
	import type { ProgramCourse } from "../../model/course";
	import {
		type SidebarAction,
		type AddCourseAction,
	} from "../../model/sidebar";
	import CourseInfo from "./CourseInfo.svelte";
	import CourseList from "./CourseList.svelte";
	let { action }: { action: SidebarAction } = $props();
	let value = $derived<AddCourseAction>(action.value as AddCourseAction);

	let selectedCourse = $state<ProgramCourse | null>(null);
	let selectableCourses = $derived(
		value.period.courses.filter(
			(c) => !value.period.selectedCourses.some((s) => c.id == s.id),
		),
	);

	function onCourseSelected(course: ProgramCourse) {
		selectedCourse = course;
	}

	function addCourse() {
		if (selectedCourse == null) return;

		value.onCourseSelected(selectedCourse);
	}
</script>

{#if selectedCourse == null}
	<CourseList courses={selectableCourses} onClick={onCourseSelected} />
{:else}
	<CourseInfo course={selectedCourse.info} />

	<button
		class="p-2 bg-blue-500 text-white w-full mt-4 rounded-md hover:bg-blue-600"
		onclick={addCourse}>Lägg till</button
	>
{/if}
