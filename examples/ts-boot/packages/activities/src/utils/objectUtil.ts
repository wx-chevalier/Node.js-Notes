
/**
 * pick object.
 *
 * @export
 * @template T
 * @param {object} source
 * @param {...string[]} fields
 * @returns {T}
 */
export function pick<T>(source: object, ...fields: string[]): T {
    let pickObj: any = {};
    fields.forEach(field => {
        pickObj[field] = source[field];
    });
    return pickObj as T;
}
