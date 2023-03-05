// TODO make these functions generic

export const getObjectDifference = (obj1: any, obj2: any): any => {
    const diff: any = {};

    for (const key in obj2) {
        if (Array.isArray(obj2[key])) {
            const subDiff = compareArrays(obj1[key], obj2[key]);
            if (Object.keys(subDiff).length) {
                diff[key] = subDiff;
            }
        } else if (typeof obj2[key] === 'object') {
            const subDiff = getObjectDifference(obj1[key], obj2[key]);
            if (Object.keys(subDiff).length) {
                diff[key] = subDiff;
            }
        } else if (obj2[key] !== obj1[key]) {
            diff[key] = obj2[key];
        }
    }
    return diff;
};

const compareArrays = (oldArr: any[], newArr: any[]): any[] => {
    if (oldArr.length !== newArr.length) {
        return newArr;
    }

    const diff = newArr.reduce((result, el, i) => {
        const subDiff = getObjectDifference(oldArr[i], newArr[i]);
        if (Object.keys(subDiff).length) {
            result[i] = subDiff;
        }
        return result;
    }, []);

    return diff.length ? diff : [];
};