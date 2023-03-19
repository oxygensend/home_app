export const replaceElementsInObject = <T extends object>(obj: T, newValues: Partial<T>): T => {
    return { ...obj, ...newValues };
};
