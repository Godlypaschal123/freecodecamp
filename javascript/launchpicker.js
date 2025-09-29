// Initialize empty lunch menu
let lunches = [];

// Add lunch to end
function addLunchToEnd(array, item) {
    array.push(item);
    console.log(`${item} added to the end of the lunch menu.`);
    return array;
}

// Add lunch to start
function addLunchToStart(array, item) {
    array.unshift(item);
    console.log(`${item} added to the start of the lunch menu.`);
    return array;
}

// Remove last lunch
function removeLastLunch(array) {
    if (array.length === 0) {
        console.log("No lunches to remove.");
    } else {
        const removed = array.pop();
        console.log(`${removed} removed from the end of the lunch menu.`);
    }
    return array;
}

// Remove first lunch
function removeFirstLunch(array) {
    if (array.length === 0) {
        console.log("No lunches to remove.");
    } else {
        const removed = array.shift();
        console.log(`${removed} removed from the start of the lunch menu.`);
    }
    return array;
}

// Get random lunch
function getRandomLunch(array) {
    if (array.length === 0) {
        console.log("No lunches available.");
    } else {
        const randomIndex = Math.floor(Math.random() * array.length);
        console.log(`Randomly selected lunch: ${array[randomIndex]}`);
    }
}

// Show lunch menu
function showLunchMenu(array) {
    if (array.length === 0) {
        console.log("The menu is empty.");
    } else {
        console.log(`Menu items: ${array.join(", ")}`);
    }
}