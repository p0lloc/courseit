const BASE_URL = "https://cloud.timeedit.net/chalmers/web/public/";
const tabledata = [
	["h=t&sid=", "6="],
	["objects=", "1="],
	["sid=", "2="],
	["&ox=0&types=0&fe=0", "3=3"],
	["&types=0&fe=0", "5=5"],
	["&h=t&p=", "4="],
];
const tabledataspecial = [
	["=", "ZZZX1"],
	["&", "ZZZX2"],
	[",", "ZZZX3"],
	[".", "ZZZX4"],
	[" ", "ZZZX5"],
	["-", "ZZZX6"],
	["/", "ZZZX7"],
	["%", "ZZZX8"],
];
const pairs = [
	["=", "Q"],
	["&", "Z"],
	[",", "X"],
	[".", "Y"],
	[" ", "V"],
	["-", "W"],
];
const pattern = [
	4, 22, 5, 37, 26, 17, 33, 15, 39, 11, 45, 20, 2, 40, 19, 36, 28, 38, 30, 41,
	44, 42, 7, 24, 14, 27, 35, 25, 12, 1, 43, 23, 6, 16, 3, 9, 47, 46, 48, 50,
	21, 10, 49, 32, 18, 31, 29, 34, 13, 8,
];

function toString(string: string) {
	if (isEmpty(string)) {
		return "";
	}
	return `${string}`;
}

function isEmpty(str: string) {
	return !str || str.length === 0
}

function tablespecial(result: string) {
	for (let i = 0; i < 100; i++) {
		for (const key of tabledataspecial) {
			result = result.replace(key[0], key[1]);
		}
	}
	return result;
}

function tableshort(result: string): string {
	for (const key of tabledata) {
		result = result.replace(key[0], key[1]);
	}
	return result;
}

function modKey(ch: number): number {
	if (ch >= 97 && ch <= 122) {
		return 97 + ((ch - 88) % 26);
	}
	if (ch >= 49 && ch <= 57) {
		return 49 + ((ch - 45) % 9);
	}
	return ch;
}

function scrambleChar(ch: string): string {
	for (const pair of pairs) {
		if (ch === pair[0]) {
			return pair[1];
		}
		if (ch === pair[1]) {
			return pair[0];
		}
	}
	return String.fromCharCode(modKey(ch.charCodeAt(0)));
}

function swap(result: any[], from: number, to: number) {
	if (from < 0 || from >= result.length || to < 0 || to >= result.length) {
		return;
	}
	const fromChar = result[from];
	result[from] = result[to];
	result[to] = fromChar;
}

function swapPattern(result: string[]) {
	const steps = Math.ceil(result.length / pattern.length);
	for (let step = 0; step < steps; step++) {
		for (let index = 1; index < pattern.length; index += 2) {
			swap(
				result,
				pattern[index] + step * pattern.length,
				pattern[index - 1] + step * pattern.length,
			);
		}
	}
}

function swapChar(result: string) {
	const split = result.split("");
	for (let index = 0; index < split.length; index++) {
		split[index] = scrambleChar(split[index]);
	}
	swapPattern(split);
	return split.join("");
}

function scramble(query: string) {
	if (isEmpty(query) || query.length < 2 || query.substring(0, 2) === "i=") {
		return query;
	}
	let result = decodeURIComponent(query);
	result = tableshort(result);
	result = swapChar(result);
	result = tablespecial(result);
	return encodeURIComponent(result);
}

export function generateTimetableUrl(courses: string[], dateStart: string, dateEnd: string) {
	let keyValues = ["h=t", "sid=3", `objects=${courses.join(",")}`, "ox=0", `p=${dateStart}-${dateEnd}`, "types=0", "fe=0", "tr=0"]
	keyValues = keyValues.map((value) => toString(value).replace(/[+]/g, " "));

	return `${BASE_URL}ri${scramble(keyValues.join("&"))}.html`;

}
