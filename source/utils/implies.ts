/**
 * if P is true, asserts that Q is of type T
 *
 * usage:
 *
 * ```ts
 * let P: boolean;
 * let Q: T | undefined | null;
 *
 * implies<T>(Q, P);
 *
 * /// => Q is of type T, or an error is thrown
 *
 * ```
 */
export function implies<T>(Q: unknown, P: boolean): asserts Q is T {
	if (!P) {
		throw new Error();
	}
}
