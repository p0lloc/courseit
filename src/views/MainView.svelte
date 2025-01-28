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
    // noinspection ES6UnusedImports
    import Fa from "svelte-fa";
    import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
    import {calculateTimeTableConflictsForPeriod, setConflictsForPrograms} from "../services/timetable";
    import {findExamConflicts} from "../services/exam";
    import {savedProgramPlans} from "../main";

    let sidebar = $state<Sidebar | undefined>();
    let extendedCourses = $state(false);

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
                    onPeriodUpdated(period);
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

                    onPeriodUpdated(period);
                    sidebar?.close();
                },
            },
        });
    }

    function selectMaster() {
        sidebar?.open({
            type: SidebarActionType.SELECT_MASTER,
            value: {
                programs: appData.programs.filter(p => p.master != null),
                info: appData.masterPrograms,
                onProgramSelected: (program: Program) => {
                    master = structuredClone($state.snapshot(program));
                    sidebar?.close();
                },
            }
        });
    }

    /**
     * Called when a program period was updated (course added/removed).
     * Automatically calculates timetable and exam conflicts.
     */
    async function onPeriodUpdated(period: ProgramPeriod) {
        let dates = appData.periodDates.find(p => p.id == period!.id);
        if (dates == null) return;

        let courseCodes = [];
        let timeTableIds = [];
        for (let course of period.selectedCourses) {
            courseCodes.push(course.id);
            timeTableIds.push(appData.timeTableIds[course.id]);
        }

        period.examConflicts = findExamConflicts(period.selectedCourses.map(c => c.info));
        period.timeTableConflicts = await calculateTimeTableConflictsForPeriod(timeTableIds, courseCodes, dates.from, dates.to);
    }

    /**
     * Calculates and sets exam conflicts for all the years/periods of a program.
     */
    function calculateExamConflictsForProgram(program: Program) {
        program.years.forEach(y =>
            y.periods.forEach(p => p.examConflicts = findExamConflicts(p.selectedCourses.map(c => c.info))));
    }

    /**
     * Loads a saved study plan by id and automatically recalculates conflicts.
     */
    async function loadSavedPlan(id: string) {
        let loaded = savedProgramPlans.loadPlanById(id, appData.programs);
        if (loaded == null) return;

        let [mainProgram, loadedMaster] = loaded;
        program = mainProgram;
        master = loadedMaster;

        let firstDate = appData.periodDates[0].from;
        let lastDate = appData.periodDates[appData.periodDates.length - 1].to;

        let programsToCheck = master != null ? [program, master] : [program];
        await setConflictsForPrograms(appData.timeTableIds,
            programsToCheck,
            firstDate, lastDate, appData.periodDates);

        // Calculate exam conflicts for all years + periods
        programsToCheck.forEach(p => calculateExamConflictsForProgram(p));
    }
</script>

<div class="md:w-1/2 mx-auto py-10 px-4 md:px-0">
    <div class="flex justify-center md:justify-end mb-4 flex-wrap gap-2">
        <PersistenceOptions mainProgram={program} master={master} onLoadPlan={loadSavedPlan}/>
        <div class="border-r mx-4 md:block hidden"></div>
        <div class="flex items-center gap-2"><input type="checkbox" bind:checked={extendedCourses}/> Utökade kurser
        </div>
    </div>
    <div class="mb-4">
        {#each getCreditErrors(necessaryPoints) as error }
            <div class="font-bold text-red-500 flex items-center gap-2">
                <Fa icon={faTriangleExclamation}/>
                {error}
            </div>
        {/each}
    </div>

    <ProgramContainer {extendedCourses} timeTableIds={appData.timeTableIds} periodDates={appData.periodDates}
                      {onAddCourse} {onExistingCourse} {program} showProgramName={false}/>

    <div class="mt-8">
        {#if master == null}
            <SelectMasterButton onClick={selectMaster}/>
        {:else}
            <ProgramContainer {extendedCourses} onSwitch={selectMaster} timeTableIds={appData.timeTableIds}
                              periodDates={appData.periodDates}
                              {onAddCourse} {onExistingCourse} program={master}/>
        {/if}
    </div>
</div>

<Sidebar bind:this={sidebar}/>
