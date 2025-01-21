<script lang="ts">
   import ProgramContainer from "../components/program/ProgramContainer.svelte";
   import SelectMasterButton from "../components/SelectMasterButton.svelte";
   import PersistenceOptions from "../components/persistence/PersistenceOptions.svelte";
   import Sidebar from "../components/sidebar/Sidebar.svelte";
   import {
      type Program,
      type ProgramCourse,
      type ProgramPeriod,
   } from "../model/course";
   import { SidebarActionType } from "../model/sidebar";

   let sidebar = $state<Sidebar | undefined>();

   let { appData }: { appData: AppData } = $props();

   let program = $state<Program>(appData.programs[appData.programs.length - 1]);

   function onAddCourse(period: ProgramPeriod) {
      sidebar?.open({
         type: SidebarActionType.ADD_COURSE,
         value: {
            period,
            onCourseSelected: (c) => {
               period.selectedCourses.push(c);
               sidebar.close();
            },
         },
      });
   }

   function onExistingCourse(period: ProgramPeriod, course: ProgramCourse) {
      sidebar?.open({
         type: SidebarActionType.EXISTING_COURSE,
         value: {
            period,
            course,
            onCourseDeleted: () => {
               period.selectedCourses = period.selectedCourses.filter(
                  (c) => c.id != course.id,
               );
               sidebar.close();
            },
         },
      });
   }
</script>

<div class="md:w-1/2 mx-auto py-10 px-4 md:px-0">
   <div class="flex justify-center md:justify-end mb-4">
      <PersistenceOptions />
   </div>

   <ProgramContainer {onAddCourse} {onExistingCourse} {program} />
   <div class="mt-8">
      <SelectMasterButton />
   </div>
</div>

<Sidebar bind:this={sidebar} />
