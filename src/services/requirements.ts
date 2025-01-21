import type {Course, Program} from "../model/course";

export enum CreditType {
    MTS = "MTS",
    NATURE = "NATURE",
    ELECTIVE_IT = "ELECTIVE_IT"
}

export const NECESSARY_CREDITS: Record<CreditType, number> = {
    [CreditType.MTS]: 7.5,
    [CreditType.NATURE]: 7.5,
    [CreditType.ELECTIVE_IT]: 3 * 7.5,
}

export const CREDIT_NAMES: Record<CreditType, string> = {
    [CreditType.MTS]: "MTS-kurser",
    [CreditType.NATURE]: "kurser inom naturvetenskap",
    [CreditType.ELECTIVE_IT]: "valbara IT-kurser",
}

export function isITCourse(course: Course): boolean {
    return course.mainSubjects?.includes("Informationsteknik");
}

export function getCreditErrors(creditsLeft: Record<CreditType, number>): string[] {
    let errors: string[] = [];
    for (let [creditType, pointsLeft] of Object.entries(creditsLeft)) {
        if (pointsLeft <= 0)
            continue;

        errors.push(`Du saknar ${CREDIT_NAMES[creditType as CreditType]} på ${pointsLeft}HP!`);
    }
    return errors;
}

export function calculateNecessaryProgramPoints(programs: Program[]): Record<CreditType, number> {
    let necessaryPoints = structuredClone(NECESSARY_CREDITS);

    for (let program of programs) {
        let totalPoints = calculateTotalProgramPoints(program);
        for (let [creditType, points] of Object.entries(totalPoints)) {
            necessaryPoints[creditType as CreditType]
                = Math.max(0, necessaryPoints[creditType as CreditType] - points);
        }
    }

    return necessaryPoints;
}

export function calculateTotalProgramPoints(program: Program): Record<CreditType, number> {

    let mtsCredits = 0;
    let natureCredits = 0;
    let electiveItCredits = 0;
    for (let year of program.years) {
        for (let period of year.periods) {
            for (let selectedCourse of period.selectedCourses) {
                let credit = selectedCourse.info.credit;

                mtsCredits += selectedCourse.mts;

                if (!selectedCourse.compulsory && !selectedCourse.thesis && isITCourse(selectedCourse.info)) {
                    electiveItCredits += credit;
                }

                if (selectedCourse.nature) {
                    natureCredits += credit;
                }
            }
        }
    }

    return {
        [CreditType.MTS]: mtsCredits,
        [CreditType.NATURE]: natureCredits,
        [CreditType.ELECTIVE_IT]: electiveItCredits
    }
}

export function getMaxStudents(course: Course): Set<number> {
    let maxStudents: Set<number> = new Set();
    for (let round of course.rounds) {
        if (round.max <= 0) continue;
        maxStudents.add(round.max);
    }

    return maxStudents;
}
