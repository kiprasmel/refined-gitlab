/**
 * https://stackoverflow.com/a/57989288
 */

export const removeUndefined = <T>(value: T | undefined): value is T => value !== undefined;
