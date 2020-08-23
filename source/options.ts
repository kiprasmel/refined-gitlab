import optionsStorage from "./scripts-background/options-storage";

optionsStorage.syncForm("#options-form");

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const rangeInputs = [...document.querySelectorAll<HTMLInputElement>('input[type="range"][name^="color"]')];
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const numberInputs = [...document.querySelectorAll<HTMLInputElement>('input[type="number"][name^="color"]')];
const output = document.querySelector(".color-output");

function updateColor(): void {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	output.style.backgroundColor = `rgb(${rangeInputs[0].value}, ${rangeInputs[1].value}, ${rangeInputs[2].value})`;
}

function updateInputField(event: any): void {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	numberInputs[rangeInputs.indexOf(event.currentTarget)].value = event.currentTarget.value;
}

for (const input of rangeInputs) {
	input.addEventListener("input", updateColor);
	input.addEventListener("input", updateInputField);
}

window.addEventListener("load", updateColor);
