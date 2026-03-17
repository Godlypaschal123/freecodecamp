
const footballTeam = {
    team: "Dream FC",
    year: 2026,
    headCoach: "Alex Ferguson",
    players: [
        { name: "Lionel Messi", position: "forward", isCaptain: true },
        { name: "Cristiano Ronaldo", position: "forward", isCaptain: false },
        { name: "Luka Modric", position: "midfielder", isCaptain: false },
        { name: "Virgil van Dijk", position: "defender", isCaptain: false },
        { name: "Manuel Neuer", position: "goalkeeper", isCaptain: false }
    ]
};


const teamEl = document.getElementById("team");
const yearEl = document.getElementById("year");
const coachEl = document.getElementById("head-coach");
const playerCardsEl = document.getElementById("player-cards");
const filterSelect = document.getElementById("players");


teamEl.textContent = footballTeam.team;
yearEl.textContent = footballTeam.year;
coachEl.textContent = footballTeam.headCoach;


function createPlayerCard(player) {
    const card = document.createElement("div");
    card.className = "player-card";

    const h2 = document.createElement("h2");
    h2.textContent = player.isCaptain ? `(Captain) ${player.name}` : player.name;

    const p = document.createElement("p");
    p.textContent = `Position: ${player.position}`;

    card.appendChild(h2);
    card.appendChild(p);

    return card;
}


function displayPlayers(position = "all") {

    playerCardsEl.innerHTML = "";


    const filteredPlayers = position === "all"
        ? footballTeam.players
        : footballTeam.players.filter(player => player.position === position);


    filteredPlayers.forEach(player => {
        const card = createPlayerCard(player);
        playerCardsEl.appendChild(card);
    });
}


displayPlayers();


filterSelect.addEventListener("change", (e) => {
    displayPlayers(e.target.value);
});