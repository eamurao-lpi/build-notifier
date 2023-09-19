// NOTE: Could be improved. This is only a temporary easy and fast fix for the problem.

export const urlCombiner = (first: string, last: string) => {
    // Prevents from having something like "domain.com//path1//path2"
    if (last.startsWith("/")) {
        last = last.substring(1);
    }

    if (first.endsWith("/")) {
        first = first.slice(0, -1)
    }

    return `${first}/${last}`
}