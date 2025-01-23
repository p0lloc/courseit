<script lang="ts">
	import {
		type SidebarAction,
		type ExistingCourseAction,
	} from "../../../model/sidebar";
	import CourseInfo from "../CourseInfo.svelte";
	let { action }: { action: SidebarAction } = $props();
	let value = $derived<ExistingCourseAction>(
		action.value as ExistingCourseAction,
	);
</script>

<CourseInfo course={value.course.info} />
<button
	class="p-2 bg-red-500 text-white w-full mt-4 rounded-md hover:bg-red-600"
	onclick={value.onCourseDeleted}>Ta bort</button
>
