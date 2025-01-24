export function formatDateYYYYMMDD(date: Date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return year + "-" + month + "-" + day;
}
