import type { Course, Program } from "../model/course";
import type { PeriodDates } from "../model/timetable";

export interface AppData {
    courses: Course[];
    timeTableIds: Record<string, string>,
    programs: Program[];
    periodDates: PeriodDates[]
}

export async function loadAppData(): Promise<AppData> {
    let courses = await loadCourseInfo();
    let timeTableIds = await loadTimeTableIds();
    let programs = await loadPrograms();
    let periodDates = await loadPeriodDates();

    programs.forEach(p => setupProgram(p, courses));

    return {
        courses,
        timeTableIds,
        programs,
        periodDates,
    }
}

async function loadCourseInfo(): Promise<Course[]> {
    let programs = await fetch("/courses.json");
    return await programs.json();
}

async function loadTimeTableIds(): Promise<Record<string, string>> {
    let timetableIds = await fetch("/timetable_ids.json");
    return await timetableIds.json();
}

async function loadPrograms(): Promise<Program[]> {
    let programs = await fetch("/programs.json");
    return await programs.json();
}

async function loadPeriodDates(): Promise<PeriodDates[]> {
    let programs = await fetch("/periods.json");
    return await programs.json();
}

function setupProgram(program: Program, courseInfo: Course[]) {
    for (let year of program.years) {
        for (let period of year.periods) {
            let result = [];
            let selectedCourses = [];
            for (let course of period.courses) {
                // Don't add cancelled courses to the result
                if (course.cancelled) continue;

                let info = courseInfo.find(c => c.id == course.id);
                if (info == null) continue;

                course.info = info;
                result.push(course);

                // Compulsory courses should be selected by default
                if (course.compulsory)
                    selectedCourses.push(course);

                if (!program.master && course.moments.some(v => v.rule == "X")) {
                    selectedCourses.push(course);
                }
            }

            period.courses = result;
            period.selectedCourses = selectedCourses;
            period.conflicts = [];
        }
    }
}

