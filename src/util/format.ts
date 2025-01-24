export function formatDateYYYYMMDD(date: Date) {
    return date.toISOString().split('T')[0];
}
