
interface ScheduleItem {
    course: string,
    start: number,
    end: number
}

const IGNORED_ACTIVITIES = ["laboration", "handledning", "lab", "övning"];

/**
 * Fetches a schedule from TimeEdit for the specified courses and range.
 * Ignores specific activities that are not seen as "compulsory".
 *
 * @return Map of midnight timestamp -> list of items for that day
 */
async function fetchTimeTable(timeTableIds: string[], courseCodes: string[], dateStart: string, dateEnd: string): Promise<Map<number, ScheduleItem[]>> {
    let url = `https://cloud.timeedit.net/chalmers/web/public/ri.json?h=f&sid=3&p=${dateStart}-${dateEnd}&objects=${timeTableIds.join(",")}&ox=0&types=0&fe=0&h2=f`;
    let res = await fetch(url);

    let json = await res.json();

    let items: Map<number, ScheduleItem[]> = new Map();
    for (let reservation of json.reservations) {
        let course = courseCodes.find(c => reservation.columns[0].includes(c));
        if (course == undefined) continue;

        let activity = reservation.columns[3];
        if(IGNORED_ACTIVITIES.includes(activity.toLowerCase())) continue;

        let [dateStart, midnight] = parseReservationDate(reservation.startdate, reservation.starttime);
        let [dateEnd, _] = parseReservationDate(reservation.enddate, reservation.endtime);

        let item: ScheduleItem = {
            course,
            start: dateStart,
            end: dateEnd,
        }

        let existing = items.get(midnight);
        if (existing != null) {
            existing.push(item);
        } else {
            items.set(midnight, [item]);
        }
    }

    return items;
}

export async function calculateTimeTableConflicts(timeTableIds: string[], courseCodes: string[], dateStart: string, dateEnd: string): Promise<Date[]> {
    let timeTable = await fetchTimeTable(timeTableIds, courseCodes, dateStart, dateEnd);

    let conflicts = [];
    for (let [date, i] of timeTable.entries()) {
        if(findConflictsForDay(i)){
            conflicts.push(new Date(date));
        }
    }
    return conflicts;

}

function areItemsConflicting(first: ScheduleItem, second: ScheduleItem){
    return first.start >= second.start && first.start <= second.end;
}

function findConflictsForDay(items: ScheduleItem[]): boolean {
    let last: ScheduleItem | null = null;
    for (let item of items) {
        if(last != null) {
            if (areItemsConflicting(item, last)) {
                if(item.course != last.course){
                    // If items are not of same course, count as conflict
                    return true;
                } else {
                    // If there are multiple simultaneous items of same course, set "last" to the item that ends later.
                    if(item.end < last.end){
                        continue;
                    }
                }
            }
        }

        last = item;
    }
    return false;
}

function parseReservationDate(dateStr: string, timeStr: string): [number, number] {
    let midnight = new Date(dateStr);
    let date = new Date(midnight);
    let [hh, mm] = parseHhMm(timeStr);
    date.setHours(hh);
    date.setMinutes(mm);

    return [date.getTime(), midnight.getTime()];
}

function parseHhMm(hhMM: string) {
    let parts = hhMM.split(":");
    if (parts.length == 0) return [0, 0];

    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);

    return [hours, minutes];
}
