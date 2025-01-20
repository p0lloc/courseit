<script>
   import Year from "../components/program/Year.svelte";
   import ProgramContainer from "../components/program/ProgramContainer.svelte";
   import SelectMasterButton from "../components/SelectMasterButton.svelte";
   import PersistenceOptions from "../components/persistence/PersistenceOptions.svelte";
   import Sidebar from "../components/sidebar/Sidebar.svelte";

   let sidebarVisible = $state(true);

   function closeSidebar(){
      sidebarVisible = false;
   }
</script>

<div class="md:w-1/2 mx-auto py-10 px-4 md:px-0">
   <div class="flex justify-center md:justify-end mb-4">
      <PersistenceOptions/>
   </div>

   <ProgramContainer />
   <div class="mt-8">
      <SelectMasterButton/>
   </div>
</div>

<Sidebar visible={sidebarVisible} onClose={closeSidebar} />
