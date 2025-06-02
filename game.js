let currentRoom = 'Manager’s Office';
let lore = [];
let currentPage = 0;
let powerOn = false;

const rooms = {
  "Manager’s Office": {
    desc: "You are in the Manager’s Office.",
    actions: [{ text: "Search the desk", action: () => unlockLore("A dusty journal sits inside.") }]
  },
  "Storage Closet": {
    desc: "You are in the Storage Closet. It’s cluttered and dim.",
    actions: [{ text: "Check behind the boxes", action: () => unlockLore("You find a small key labeled 'Office'.") }]
  },
  "Janitor’s Room": {
    desc: "Mops and buckets fill the room. There’s something off about it.",
    actions: [{ text: "Inspect cleaning supplies", action: () => unlockLore("A strange liquid is labeled as memory suppressant.") }]
  },
  "Break Room": {
    desc: "An old break room with flickering lights and vending machines.",
    actions: [{ text: "Search vending machine", action: () => unlockLore("Inside you find a torn ID card.") }]
  },
  "Security Room": {
    desc: "Monitors flicker with static. You see glimpses of other rooms.",
    actions: [{ text: "Access terminal", action: () => unlockLore("Security logs mention Subject 0 becoming erratic.") }]
  },
  "Power Room": {
    desc: "The facility's power room. A generator hums in the corner.",
    actions: [{
      text: "Restore power", action: () => {
        if (!powerOn) {
          powerOn = true;
          unlockLore("Power restored. Lights flicker back on.");
        }
      }
    }]
  },
  "Observation Room": {
    desc: "One-way glass peers into a dark chamber below.",
    actions: [{ text: "Inspect observation notes", action: () => unlockLore("‘They stopped responding to names.’") }]
  },
  "Elevator Control Room": {
    desc: "A panel glows faintly near the elevator controls.",
    actions: [{
      text: "Press button for Sub-2", action: () => {
        if (powerOn) unlockLore("Sub-2 access granted.");
        else alert("The button does nothing. No power.");
      }
    }]
  },
  "Maintenance Hall": {
    desc: "A narrow hallway lit by red emergency lights.",
    actions: [{
      text: "Open maintenance hatch", action: () => {
        if (powerOn) unlockLore("You flip a switch. G-3 access enabled.");
        else alert("You need power to open this.");
      }
    }]
  }
};

function startGame() {
  document.getElementById("fade-screen").classList.add("hidden");
  setTimeout(() => {
    document.getElementById("title-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
    updateRoom("Manager’s Office");
  }, 2000);
}

function showSettings() {
  document.getElementById("title-screen").classList.remove("active");
  document.getElementById("settings-screen").classList.add("active");
}

function goBack() {
  document.getElementById("settings-screen").classList.remove("active");
  document.getElementById("title-screen").classList.add("active");
}

function updateRoom(name) {
  currentRoom = name;
  document.getElementById("map-info").innerHTML = `Level: B1<br>Room: ${name}`;
  document.getElementById("room-description").innerText = rooms[name].desc;
  const actions = rooms[name].actions;
  const container = document.getElementById("room-actions");
  container.innerHTML = "";
  actions.forEach(act => {
    const btn = document.createElement("button");
    btn.innerText = act.text;
    btn.onclick = act.action;
    container.appendChild(btn);
  });
}

function unlockLore(entry) {
  if (!lore.includes(entry)) {
    lore.push(entry);
    currentPage = lore.length - 1;
    updateLore();
  }
}

function updateLore() {
  const container = document.getElementById("lore-pages");
  container.innerText = lore[currentPage] || "No lore yet.";
}

function prevPage() {
  if (currentPage > 0) currentPage--;
  updateLore();
}

function nextPage() {
  if (currentPage < lore.length - 1) currentPage++;
  updateLore();
}

function toggleTab(name) {
  ["lore", "map"].forEach(tab => {
    const element = document.getElementById(`${tab}-tab`);
    element.classList.toggle("active", tab === name);
  });
}
