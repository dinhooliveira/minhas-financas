export function padStart(number, digits = 2, emptyDigit = 0) {
	let length = 0;
	let n = Math.abs(number);
	let absoluteNumber = n;
	do {
		n /= 10;
		length++;
	} while (n >= 1);
	const prefix = Array(Math.max((digits - length) + 1, 0)).join(emptyDigit);
	return number < 0 ? `-${prefix}${absoluteNumber}` : prefix + number;
}