function steamrollArray(arr) {
    const result = [];

    function flatten(element) {
        if (Array.isArray(element)) {
            for (let i = 0; i < element.length; i++) {
                flatten(element[i]);
            }
        } else {
            result.push(element);
        }
    }

    flatten(arr);
    return result;
}