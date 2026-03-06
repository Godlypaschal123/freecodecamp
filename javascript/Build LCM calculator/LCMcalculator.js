function smallestCommons(arr) {

    const [min, max] = arr.sort((a, b) => a - b);


    function gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }


    function lcm(a, b) {
        return (a * b) / gcd(a, b);
    }

    let multiple = min;

    for (let i = min + 1; i <= max; i++) {
        multiple = lcm(multiple, i);
    }

    return multiple;
}