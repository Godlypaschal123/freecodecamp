function getIndexToIns(arr, num) {

    arr.sort((a, b) => a - b);


    const index = arr.findIndex(element => num <= element);


    return index === -1 ? arr.length : index;
}