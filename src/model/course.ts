import type {MasterProgram} from "./master";

export interface Course {
    id: string;
    name: string;
    mainSubjects: string[];
    rounds: CourseRound[];
    credit: number;
    passRate: number;
    purpose: string;
    litterature: string;
    prerequisites: string;
    exams: Exam[];
    specificRequirements: string;
}

export interface Exam {
    timestamp: number;
    morning: boolean;
}

export interface CourseRound {
    url: string;
    block: string;
    max: number;
}

export interface Program {
    id: string;
    name: string;
    years: ProgramYear[];
    master: MasterProgram | null;
}

export interface ProgramYear {
    year: number;
    periods: ProgramPeriod[];
}

export interface ExamConflict {
    firstCourse: string;
    secondCourse: string;
    date: Date;
}

export interface ProgramPeriod {
    id: string;
    courses: ProgramCourse[];
    selectedCourses: ProgramCourse[];
    timeTableConflicts: Date[];
    examConflicts: ExamConflict[];
}

export interface ProgramCourse {
    id: string;
    name: string;
    mts: number;
    moments: CourseMoment[];
    nature: boolean;
    compulsory: boolean;
    thesis: boolean;
    cancelled: boolean;
    info: Course;
}


export interface CourseMoment {
    rule: string;
    moduleType: string;
    credit: string;
}
