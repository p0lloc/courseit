<script lang="ts">
	import type { ProgramCourse } from "../../model/course";
	import {
		type SidebarAction,
		type AddCourseAction,
	} from "../../model/sidebar";
	import CourseInfo from "./CourseInfo.svelte";
	import CourseList from "./CourseList.svelte";
	// noinspection ES6UnusedImports
	import Fa from "svelte-fa";
	import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
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

	function back(){
		selectedCourse = null;
	}
</script>

{#if selectedCourse == null}
	<h2 class="text-2xl mb-2">Välj kurs</h2>
	<CourseList courses={selectableCourses} onClick={onCourseSelected} />
{:else}
	<button onclick={back}>
		<Fa icon={faArrowLeft} />
	</button>
	<CourseInfo course={selectedCourse.info} />

	<button
		class="p-2 bg-blue-500 text-white w-full mt-4 rounded-md hover:bg-blue-600"
		onclick={addCourse}>Lägg till</button
	>
{/if}
