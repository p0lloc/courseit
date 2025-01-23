import type {Course} from "../model/course";

export function syllabusUrl(course: Course): string {
    if(course.rounds.length > 0)
        return course.rounds[0].url;

    return "";
}

export function examStatisticsUrl(courseCode: string): string {
    return `https://stats.ftek.se/${courseCode}/`
}

export function coursePlanUrl(courseCode: string): string {
    return `https://www.chalmers.se/utbildning/dina-studier/hitta-kurs-och-programplaner/kursplaner/${courseCode}/?acYear=2024/2025`
}

export function masterProgramUrl(slug: string): string {
    return `https://www.chalmers.se/en/education/find-masters-programme/${slug}/`;
}
