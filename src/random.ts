const letters = `abcdefghijklmnopqrstuvwxyz`;
const lowerCaseLetters = letters.split('');
const upperCaseLetters = letters.toUpperCase().split('');

const choices = [].concat(lowerCaseLetters, upperCaseLetters);

export default (length: number) => {
	const getChar = () => choices[Math.floor(Math.random() * choices.length)];

	let chars = ``;
	for (let cur = 0; cur < length; cur++) {
		chars += getChar();
	}

	return chars;
};
