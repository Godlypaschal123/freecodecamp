function destroyer(arr, ...valuesToRemove) {
    return arr.filter(item => !valuesToRemove.includes(item));
}