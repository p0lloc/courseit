import type {SavedProgram, SavedProgramPeriod, SavedProgramPlan, SavedProgramYear} from "../model/persistence";
import {get, type Readable, type Subscriber, type Unsubscriber, type Writable, writable} from "svelte/store";
import type {Program, ProgramCourse, ProgramPeriod, ProgramYear} from "../model/course";

const PROGRAMS_STORAGE_KEY = "programs";

export class ProgramPlanStore implements Readable<SavedProgramPlan[]> {

    private writable: Writable<SavedProgramPlan[]> = writable([]);

    load() {
        let programsStr = localStorage.getItem(PROGRAMS_STORAGE_KEY);
        if (programsStr == null) return;

        this.writable.set(JSON.parse(programsStr));
    }

    create(name: string, mainProgram: Program, master: Program | null): SavedProgramPlan {
        let savedPlan: SavedProgramPlan = {
            id: crypto.randomUUID(),
            name,
            mainProgram: this.convertProgramToSaved(mainProgram),
            master: master == null ? null : this.convertProgramToSaved(master)
        }

        this.writable.update(v => [...v, savedPlan]);
        this.save();
        return savedPlan;
    }

    loadPlanById(id: string, programs: Program[]): [Program, Program | null] | null {
        let plan = get(this.writable).find(v => v.id == id);
        if (plan == null) return null;

        let mainProgram = this.convertSavedToProgram(plan.mainProgram, programs);
        let master = plan.master == null ? null : this.convertSavedToProgram(plan.master, programs);
        if (mainProgram == null) return null;

        return [
            mainProgram,
            master
        ];
    }

    convertSavedToProgram(saved: SavedProgram, programs: Program[]): Program | null {
        let program = programs.find(v => v.id == saved.id);
        if (program == null) return null;

        program = structuredClone(program);

        for (let year of program.years) {
            // Find corresponding year
            let savedYear = saved.years.find(v => v.year == year.year);
            if (savedYear == null) return null;
            for (let period of year.periods) {
                // Find corresponding period
                let savedPeriod = savedYear.periods.find(v => v.id == period.id);
                if (savedPeriod == null) return null;

                let selectedCourses: ProgramCourse[] = [];
                for (let courseId of savedPeriod.courses) {
                    // Find corresponding course
                    let course = period.courses.find(v => v.id == courseId);
                    if (course == null) return null;

                    selectedCourses.push(course);
                }

                period.selectedCourses = selectedCourses;
            }
        }

        return program;
    }

    private convertProgramToSaved(program: Program): SavedProgram {
        return {
            id: program.id,
            years: program.years.map(v => this.convertYearToSaved(v))
        }
    }

    private convertYearToSaved(year: ProgramYear): SavedProgramYear {
        return {
            year: year.year,
            periods: year.periods.map(v => this.convertPeriodToSaved(v))
        }
    }

    private convertPeriodToSaved(period: ProgramPeriod): SavedProgramPeriod {
        return {
            id: period.id,
            courses: period.selectedCourses.map(v => v.id),
        }
    }

    update(id: string, mainProgram: Program, master: Program | null) {
        this.writable.update(v => {
            let plan = v.find(v => v.id == id);
            if (plan != null) {
                plan.mainProgram = this.convertProgramToSaved(mainProgram);
                plan.master = master == null ? null : this.convertProgramToSaved(master);
            }

            return v;
        })

        this.save();
    }

    private save() {
        localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(get(this.writable)));
    }

    subscribe(run: Subscriber<SavedProgramPlan[]>, invalidate?: () => void): Unsubscriber {
        return this.writable.subscribe(run, invalidate);
    }

}
