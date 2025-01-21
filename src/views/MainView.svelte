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
    import {SidebarActionType} from "../model/sidebar";
    import type {AppData} from "../services/data";
    import {calculateNecessaryProgramPoints, getCreditErrors} from "../services/requirements";
    import Fa from "svelte-fa";
    import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

    let sidebar = $state<Sidebar | undefined>();

    let {appData}: { appData: AppData } = $props();

    let program = $state<Program>(appData.programs[appData.programs.length - 1]);
    let master = $state<Program | null>(null);

    let necessaryPoints = $derived(calculateNecessaryProgramPoints([program, master].filter(p => p != null)));

    function onAddCourse(period: ProgramPeriod) {
        sidebar?.open({
            type: SidebarActionType.ADD_COURSE,
            value: {
                period,
                onCourseSelected: (c) => {
                    period.selectedCourses.push(c);
                    sidebar?.close();
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
                    sidebar?.close();
                },
            },
        });
    }

    function selectMaster() {
        sidebar?.open({
            type: SidebarActionType.SELECT_MASTER,
            value: {
                programs: appData.programs.filter(p => p.master),
                onProgramSelected: (program: Program) => {
                    master = structuredClone($state.snapshot(program));
                    sidebar?.close();
                },
            }
        });
    }
</script>

<div class="md:w-1/2 mx-auto py-10 px-4 md:px-0">
    <div class="flex justify-center md:justify-end mb-4">
        <PersistenceOptions/>
    </div>

    <ProgramContainer timeTableIds={appData.timeTableIds} periodDates={appData.periodDates}
                      {onAddCourse} {onExistingCourse} {program}/>

    <div class="mt-8">
        {#if master == null}
            <SelectMasterButton onClick={selectMaster}/>
        {:else}
            <ProgramContainer onSwitch={selectMaster} timeTableIds={appData.timeTableIds} periodDates={appData.periodDates}
                              {onAddCourse} {onExistingCourse} program={master}/>
        {/if}
    </div>

    <div class="mt-4">
        {#each getCreditErrors(necessaryPoints) as error }
            <div class="font-bold text-red-500 flex items-center gap-2">
                <Fa icon={faTriangleExclamation}/>
                {error}
            </div>
        {/each}
    </div>
</div>

<Sidebar bind:this={sidebar}/>
