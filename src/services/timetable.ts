import type {Program} from "../model/course";
import type {PeriodDates} from "../model/timetable";

/**
 * Timetable activities that we don't care checking conflicts for.
 */
const IGNORED_ACTIVITIES = ["laboration", "handledning", "lab", "övning"];

interface ScheduleItem {
    course: string,
    start: number,
    end: number
}

/**
 * Calculates timetable conflicts for a specific study period, with specified timetable ids and course codes.
 */
export async function calculateTimeTableConflictsForPeriod(timeTableIds: string[], courseCodes: string[], dateStart: string, dateEnd: string): Promise<Date[]> {
    let timeTable = await fetchTimeTableItems(timeTableIds, courseCodes, dateStart, dateEnd);
    return mapScheduleItemsAndFindConflicts(timeTable);
}

/**
 * Calculates timetable conflicts for a list of programs, and sets the "timeTableConflicts" in respective study period.
 */
export async function setConflictsForPrograms(timeTableIds: Record<string, string>, programs: Program[],
                                              dateStart: string, dateEnd: string, periodDates: PeriodDates[]) {

    let courseCodes: Set<string> = new Set();
    let ids: Set<string> = new Set();
    for (let program of programs) {
        for (let year of program.years) {
            for (let period of year.periods) {
                // If this is a period with 0 elective courses, skip it.
                if(period.selectedCourses.every(c => c.compulsory || c.thesis))
                    continue;

                for (let course of period.selectedCourses) {
                    courseCodes.add(course.id);
                    ids.add(timeTableIds[course.id]!);
                }
            }
        }
    }

    let timeTable = await fetchTimeTableItems(Array.from(ids), Array.from(courseCodes), dateStart, dateEnd);
    for (let program of programs) {
        for (let year of program.years) {
            for (let period of year.periods) {
                let dates = periodDates.find(d => d.id == period.id);
                if (dates == null) continue;

                let periodStart = parsePeriodDate(dates.from);
                let periodEnd = parsePeriodDate(dates.to);

                // Schedule items matching the date range from this period and with relevant courses
                let items = timeTable.filter(i =>
                    i.start >= periodStart.getTime() && i.end <= periodEnd.getTime() &&
                    period.selectedCourses.some(c => c.id == i.course));

                period.timeTableConflicts = mapScheduleItemsAndFindConflicts(items);
            }
        }
    }
}

/**
 * Fetches all timetable items for the specified IDs and date range.
 */
async function fetchTimeTableItems(timeTableIds: string[], courseCodes: string[], dateStart: string, dateEnd: string): Promise<ScheduleItem[]> {
    let url = `https://cloud.timeedit.net/chalmers/web/public/ri.json?h=f&sid=3&p=${dateStart}-${dateEnd}&objects=${timeTableIds.join(",")}&ox=0&types=0&fe=0&h2=f`;
    let res = await fetch(url);

    let json = await res.json();

    let items: ScheduleItem[] = [];
    for (let reservation of json.reservations) {
        // Only include items with relevant course codes
        let course = courseCodes.find(c => reservation.columns[0].includes(c));
        if (course == undefined) continue;

        let activity = reservation.columns[3];
        if (IGNORED_ACTIVITIES.includes(activity.toLowerCase())) continue;

        let start = parseReservationDate(reservation.startdate, reservation.starttime);
        let end = parseReservationDate(reservation.enddate, reservation.endtime);

        let item: ScheduleItem = {
            course,
            start,
            end,
        }

        items.push(item);
    }

    return items;
}


/**
 * Maps timetable items to their day and finds conflicts during that day.
 * @return List of all dates that have conflicting items.
 */
function mapScheduleItemsAndFindConflicts(timeTable: ScheduleItem[]): Date[] {
    let items: Map<number, ScheduleItem[]> = new Map();
    for (let item of timeTable) {
        let midnight = dateToMidnight(new Date(item.start)).getTime();
        let existing = items.get(midnight);
        if (existing != null) {
            existing.push(item);
        } else {
            items.set(midnight, [item]);
        }
    }

    let conflicts = [];
    for (let [date, i] of items.entries()) {
        if (doesDayContainConflicts(i)) {
            conflicts.push(new Date(date));
        }
    }
    return conflicts;
}

function areItemsConflicting(first: ScheduleItem, second: ScheduleItem) {
    return first.start >= second.start && first.start <= second.end;
}

function doesDayContainConflicts(items: ScheduleItem[]): boolean {
    let last: ScheduleItem | null = null;
    for (let item of items) {
        if (last != null) {
            if (areItemsConflicting(item, last)) {
                if (item.course != last.course) {
                    // If items are not of same course, count as conflict
                    return true;
                } else {
                    // If there are multiple simultaneous items of same course, set "last" to the item that ends later.
                    if (item.end < last.end) {
                        continue;
                    }
                }
            }
        }

        last = item;
    }
    return false;
}

function parsePeriodDate(dateStr: string): Date {
    let date = new Date(0);
    if (dateStr.length != 8) return date;

    let year = dateStr.substring(0, 4);
    let month = dateStr.substring(4, 6);
    let day = dateStr.substring(6);
    date.setFullYear(parseInt(year));
    date.setMonth(parseInt(month));
    date.setDate(parseInt(day));

    return date;
}

function parseReservationDate(dateStr: string, timeStr: string): number {
    let date = new Date(dateStr);
    let [hh, mm] = parseHhMm(timeStr);
    date.setHours(hh);
    date.setMinutes(mm);

    return date.getTime();
}

function dateToMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseHhMm(hhMM: string) {
    let parts = hhMM.split(":");
    if (parts.length == 0) return [0, 0];

    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);

    return [hours, minutes];
}
