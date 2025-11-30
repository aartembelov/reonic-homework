import type { PartialDeep } from "type-fest";

export const generateMock =
	<SampleType extends object>(base_sample: SampleType) =>
	(override_params?: PartialDeep<SampleType>) => {
		// Create a new instance if it's a class, otherwise do a deep copy
		const instance =
			typeof base_sample === "object" && base_sample !== null
				? Object.create(Object.getPrototypeOf(base_sample))
				: deepCopy(base_sample);

		assignNested(instance, deepCopy(base_sample));

		return assignNested(instance, override_params);
	};

export const deepCopy = <T>(obj: T): T => structuredClone(obj) as T;

/**
 * Recursively assigns properties from the source object to the target object.
 * If a property in the source object is `undefined`, it deletes the corresponding property in the target object.
 * Overrides existing properties in the target object with the values from the source object.
 * Adds fields and objects that were not present in the base object before.
 *
 * @example
 * // Assign properties from source to target object
 * const target = { a: 1, b: { x: 2, y: 3 }, c: 4 };
 * const source = { b: { x: 5 }, c: 6 };
 * const result = assignNested(target, source);
 * // result: { a: 1, b: { x: 5, y: 3 }, c: 6 }
 *
 * @example
 * // Add new fields and objects to the target object
 * const target = { a: 1, b: { x: 2, y: 3 }, c: 4 };
 * const source = { d: 5, e: { z: 6 } };
 * const result = assignNested(target, source);
 * // result: { a: 1, b: { x: 2, y: 3 }, c: 4, d: 5, e: { z: 6 } }
 *
 * @example
 * // Delete properties if their values are `undefined` in the source object
 * const target = { a: 1, b: 2, c: 3 };
 * const source = { b: undefined, d: 4 };
 * const result = assignNested(target, source);
 * // result: { a: 1, c: 3, d: 4 }
 */
export const assignNested = <Target = unknown>(target: Target, source?: PartialDeep<Target>): Target => {
	if (!target) {
		target = {} as Target;
	}

	if (source) {
		for (const [key, value] of Object.entries(source) as [keyof Target, Target[keyof Target]][]) {
			const targetValue = target[key];

			if (value instanceof Date || !(typeof value === "object" && value !== null)) {
				// Direct assignment for primitives and Dates
				if (value === undefined) {
					delete target[key];
				} else {
					target[key] = value;
				}
			} else if (typeof targetValue === "object" && targetValue !== null) {
				// Deep merge for non-Date objects
				target[key] = assignNested(targetValue, value as PartialDeep<typeof targetValue>);
			} else {
				// If target doesn't have a valid object to merge into, just assign
				target[key] = value;
			}
		}
	}

	return target;
};
