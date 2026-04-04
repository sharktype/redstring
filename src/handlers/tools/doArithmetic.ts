import { Parser } from "expr-eval";

const EXPRESSION_PARSER = new Parser();

export default function doArithmetic(
	expression: string,
	decimalPlaces = 2,
): string {
	let result: number;

	try {
		result = EXPRESSION_PARSER.evaluate(expression);
	} catch (e) {
		throw new Error(`failed to evaluate expression: ${e}`);
	}

	if (!Number.isInteger(result)) {
		const factor = Math.pow(10, decimalPlaces);

		result = Math.round(result * factor) / factor;
	}

	return new Intl.NumberFormat().format(result);
}
