export const removeFromStateArray = (
    array: Array<any>,
    toRemove: any,
    property: any
) => {
    return array.filter((el: any) => el[property] !== toRemove);
};
