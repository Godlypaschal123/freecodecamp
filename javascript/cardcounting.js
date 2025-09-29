let count = 0;

function cc(card) {
    // Increase count for low cards
    if (card === 2 || card === 3 || card === 4 || card === 5 || card === 6) {
        count++;
    }
    // Decrease count for high cards
    else if (card === 10 || card === "J" || card === "Q" || card === "K" || card === "A") {
        count--;
    }
    // Cards 7, 8, 9 do not affect count

    // Decide whether to Bet or Hold
    let decision = count > 0 ? "Bet" : "Hold";
    return `${count} ${decision}`;
}