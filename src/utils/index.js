export function removeNoUseKey(obj) {
    const res = {};
    Object.keys(obj).forEach((k) => {
        if (obj[k] === undefined) {
            res[k] = '';
        }
        if (obj[k] === '') {
            res[k] = '';
        }
        if ((!Array.isArray(obj[k]) && obj[k]) || (Array.isArray(obj[k]) && obj[k].length > 0) || obj[k] === 0) {
            res[k] = obj[k];
        }
    });
    return res;
}

export function removeNoUseKeys(obj) {
    const res = {};
    Object.keys(obj).forEach((k) => {
        if ((!Array.isArray(obj[k]) && obj[k]) || (Array.isArray(obj[k]) && obj[k].length > 0) || obj[k] === 0) {
            res[k] = obj[k];
        }
    });
    return res;
}
