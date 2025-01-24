import type {Course, Exam, ExamConflict} from "../model/course";

/**
 * Finds any conflicting exam dates for the specified courses.
 */
export function findExamConflicts(courses: Course[]): ExamConflict[] {
    let map: Map<number, { course: Course, exam: Exam }> = new Map();
    let conflicts: ExamConflict[] = [];
    for (let course of courses) {
        for (let exam of course.exams) {
            let existing = map.get(exam.timestamp);
            if (existing != null && existing.exam.morning == exam.morning) {
                // Course doesn't conflict with itself...
                if(course.id == existing.course.id) continue;

                conflicts.push({
                    firstCourse: existing.course.id,
                    secondCourse: course.id,
                    date: new Date(exam.timestamp)
                });
            } else {
                map.set(exam.timestamp, {
                    course: course,
                    exam: exam,
                });
            }
        }
    }

    return conflicts;
}
