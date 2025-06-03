// ==============================
// script.js
// JavaScript logic for Project zer0
// ==============================

// --- Game State Variables ---
let currentFloor = "B1";
let currentRoom = "Manager Office";

let sub2Unlocked = false;
let g3Unlocked = false;

let loreEntries = [];
let currentLorePage = 0;

// --- List of Rooms on B1 (9 Rooms) ---
const roomsB1 = {
  "Manager Office": {
    description: "Dimly lit office with a locked desk, a closet, and a door to the hallway.",
    objects: ["closet", "desk", "note", "door"]
  },
  "Hallway": {
    description: "A narrow corridor with peeling warning signs. Doors lead to Storage, Security, and Maintenance.",
    objects: ["floorPanel", "sign"]
  },
  "Storage": {
    description: "Cramped storage room filled with dusty crates and shelves. Something might be hidden here.",
    objects: ["crateStack"]
  },
  "Security": {
    description: "A small security station with dead monitors and a terminal. A button here can unlock Sub‑2 access.",
    objects: ["terminal", "fuseBox"]
  },
  "Maintenance": {
    description: "A cluttered maintenance bay. A lever here controls a hidden circuit. A button can unlock G‑3 access.",
    objects: ["lever", "circuitPanel"]
  },
  "Dormitory": {
    description: "Empty bunks line the walls. A few personal items are scattered on the floor.",
    objects: ["bunk", "locker"]
  },
  "Workshop": {
    description: "A small workshop with tools and a workbench. Something useful could be tucked away.",
    objects: ["toolRack", "workbench"]
  },
  "Lab Storage": {
    description: "Shelves of lab supplies, vials, and dusty equipment. Labels are faded.",
    objects: ["vial", "label"]
  },
  "Office Closet": {
    description: "A cramped closet behind a filing cabinet, filled with old coats. Might hold a key item.",
    objects: ["coatRack", "hiddenSafe"]
  }
};

// --- Elements ---
const titleScreenEl = document.getElementById("titleScreen");
const settingsScreenEl = document.getElementById("settingsScreen");
const roomScreenEl = document.getElementById("room");
const messageEl = document.getElementById("message");
const objectsContainerEl = document.getElementById("objects");
const loreTabEl = document.getElementById("loreTab");
const loreBookEl = document.getElementById("loreBook");
const lorePageEl = document.getElementById("lorePage");
const mapTabEl = document.getElementById("mapTab");
const mapViewerEl = document.getElementById("mapViewer");
const mapContentEl = document.getElementById("mapContent");
const elevatorPanelEl = document.getElementById("elevatorPanel");

// --- Initialization ---
function startGame() {
  hideAllScreens();
  roomScreenEl.classList.remove("hidden");
  loreTabEl.classList.toggle("hidden", loreEntries.length === 0);
  mapTabEl.classList.remove("hidden");
  renderRoom();
  renderMap();
}

function openSettings() {
  hideAllScreens();
  settingsScreenEl.classList.remove("hidden");
}

function backToTitle() {
  hideAllScreens();
  titleScreenEl.classList.remove("hidden");
}

function hideAllScreens() {
  titleScreenEl.classList.add("hidden");
  settingsScreenEl.classList.add("hidden");
  roomScreenEl.classList.add("hidden");
  loreBookEl.classList.add("hidden");
  mapViewerEl.classList.add("hidden");
  elevatorPanelEl.classList.add("hidden");
}

// --- Room Rendering ---
function renderRoom() {
  const roomData = roomsB1[currentRoom];
  messageEl.textContent = roomData.description;
  // Clear previous object buttons
  objectsContainerEl.innerHTML = "";
  // Add buttons for each object
  roomData.objects.forEach(obj => {
    const btn = document.createElement("button");
    btn.textContent = objectLabel(obj);
    btn.onclick = () => inspect(obj);
    objectsContainerEl.appendChild(btn);
  });
}

// Helper to convert object keys to display labels
function objectLabel(key) {
  switch (key) {
    case "closet": return "Closet";
    case "desk": return "Desk";
    case "note": return "Loose Paper";
    case "door": return "Door";
    case "floorPanel": return "Loose Floor Panel";
    case "sign": return "Warning Sign";
    case "crateStack": return "Crate Stack";
    case "terminal": return "Terminal";
    case "fuseBox": return "Fuse Box";
    case "lever": return "Power Lever";
    case "circuitPanel": return "Circuit Panel";
    case "bunk": return "Bunk Bed";
    case "locker": return "Locker";
    case "toolRack": return "Tool Rack";
    case "workbench": return "Workbench";
    case "vial": return "Lab Vial";
    case "label": return "Faded Label";
    case "coatRack": return "Coat Rack";
    case "hiddenSafe": return "Hidden Safe";
    default: return key;
  }
}

// --- Navigation between Rooms ---
function moveToRoom(roomName) {
  currentRoom = roomName;
  renderRoom();
  renderMap();
  // If this room contains an elevator button, show panel
  if (roomName === "Security" || roomName === "Maintenance") {
    elevatorPanelEl.classList.remove("hidden");
  } else {
    elevatorPanelEl.classList.add("hidden");
  }
}

// --- Inspect / Interact ---
let hasKey = false;
let deskUnlocked = false;
let gotFuse = false;
let sub2ButtonPressed = false;
let g3ButtonPressed = false;

function inspect(item) {
  let msg = "";
  switch (item) {
    // --- Manager Office Interactions ---
    case "closet":
      if (!hasKey) {
        msg = "You find a small rusty key hidden behind some coats.";
        hasKey = true;
        addLore("Found a key in the closet. Something feels off about this place.");
      } else {
        msg = "Nothing else in the closet now.";
      }
      break;

    case "desk":
      if (!deskUnlocked) {
        if (hasKey) {
          msg = "You unlock the desk and discover a dusty book: the Zer0 Log.";
          deskUnlocked = true;
          addLore("Retrieved the Zer0 Log from the desk. The first clue to the experiments.");
        } else {
          msg = "The desk drawer is locked.";
        }
      } else {
        msg = "The desk drawer is empty.";
      }
      break;

    case "note":
      msg = "The note reads: 'Five. One. Seven. Freedom is an illusion.'";
      addLore("A crumpled note hints at code 517 and mentions illusory freedom.");
      break;

    case "door":
      const code = prompt("Enter 3-digit code:");
      if (code === "517") {
        msg = "The door unlocks and you step into the Hallway.";
        moveToRoom("Hallway");
        return;
      } else {
        msg = "Nothing happens. The code is incorrect.";
      }
      break;

    // --- Hallway Interactions ---
    case "floorPanel":
      msg = "You lift the loose panel and discover a security card taped underneath.";
      addLore("Found a security card under the floor panel. It might open other doors.");
      // Mark that card is found; for simplicity, assume you always keep it.
      break;

    case "sign":
      msg = "A faded sign reads: 'Quarantine Zone Ahead. Authorized Personnel Only.'";
      addLore("Faded sign warns of a Quarantine Zone. Some doors will require authorization.");
      break;

    // --- Storage Interactions ---
    case "crateStack":
      msg = "You move crates and find Fuse #17 inside.";
      gotFuse = true;
      addLore("Located Fuse #17 in Storage. It might power something back on.");
      break;

    // --- Security Station Interactions (button to unlock Sub2) ---
    case "terminal":
      if (!gotFuse) {
        msg = "The terminal is dark. It needs a fuse to power on.";
      } else if (!sub2ButtonPressed) {
        msg = "You install Fuse #17 and boot the terminal. It flashes: 'ENTER EMERGENCY OVERRIDE: 426'";
        const pass = prompt("Enter Override Code:");
        if (pass === "426") {
          msg = "Override accepted. Sub‑2 access unlocked.";
          sub2Unlocked = true;
          addLore("Pressed the Sub‑2 unlock button on the Security terminal.");
          sub2ButtonPressed = true;
        } else {
          msg = "Incorrect code. The terminal reboots.";
        }
      } else {
        msg = "Sub‑2 is already unlocked here.";
      }
      break;

    case "fuseBox":
      msg = gotFuse ? "Fuse #17 already taken." : "There's a slot labeled 'Fuse #17' here.";
      break;

    // --- Maintenance Bay Interactions (button to unlock G3) ---
    case "lever":
      msg = "You pull the lever; sparks fly and you hear a faint hum from the elevator panel.";
      addLore("Pulled the maintenance lever. Something powered up in the elevator system.");
      // Mark that maintenance area powered up
      break;

    case "circuitPanel":
      if (!g3ButtonPressed) {
        msg = "You open the circuit panel and find a red button labeled 'Unlock G‑3’. You press it.";
        g3Unlocked = true;
        g3ButtonPressed = true;
        addLore("Pressed the G‑3 unlock button in Maintenance Bay.");
      } else {
        msg = "Panel is open, but nothing else happens.";
      }
      break;

    // --- Dormitory / Workshop / Lab Storage / Office Closet ---
    case "bunk":
      msg = "The bunks are empty, but one has a bloodstain on the pillow.";
      addLore("An empty bunk with unsettling stains—something went horribly wrong here.");
      break;

    case "locker":
      msg = "The locker is locked, but the padlock is broken. Inside is a torn lab coat.";
      addLore("Found a torn lab coat in a locked locker. Could have belonged to a researcher.");
      break;

    case "toolRack":
      msg = "Most tools are missing; a single wrench lies on the floor.";
      addLore("A lone wrench on the workshop floor—useful for prying things open.");
      break;

    case "workbench":
      msg = "The workbench holds scraps of metal and a broken circuit board.";
      addLore("A broken circuit board could hint at what powered this place.");
      break;

    case "vial":
      msg = "A dusty vial labeled 'Experiment X-12'. The liquid inside has evaporated.";
      addLore("Found a vial from Experiment X-12. The notes mention memory suppression.");
      break;

    case "label":
      msg = "The label is too faded to read, but you notice 'Phase II Bio' in small print.";
      addLore("Faded label hints at Phase II Bio‑containment, confirming worse experiments below.");
      break;

    case "coatRack":
      msg = "A few coats hang here. One has a security badge clipped to it (code '027').";
      addLore("Found a security badge with code '027'—might be important later.");
      break;

    case "hiddenSafe":
      msg = "A small hidden safe built into the closet wall. It requires a 3-digit code.";
      const safeCode = prompt("Enter 3-digit code for safe:");
      if (safeCode === "027") {
        msg = "The safe clicks open. Inside is a handwritten note: 'Remember who you are.'";
        addLore("Opened the hidden safe with code 027. The note hints at lost identity.");
      } else {
        msg = "The safe remains locked.";
      }
      break;

    default:
      msg = "You examine it but nothing happens.";
  }

  messageEl.textContent = msg;
}

// --- Lore System ---
function toggleLore() {
  if (loreBookEl.classList.contains("hidden")) {
    loreBookEl.classList.remove("hidden");
    showLorePage();
  } else {
    loreBookEl.classList.add("hidden");
  }
}

function addLore(entry) {
  if (!loreEntries.includes(entry)) {
    loreEntries.push(entry);
    loreTabEl.classList.remove("hidden");
  }
}

function showLorePage() {
  if (loreEntries.length > 0) {
    lorePageEl.textContent = loreEntries[currentLorePage];
  } else {
    lorePageEl.textContent = "No lore collected yet.";
  }
}

function nextLore() {
  if (currentLorePage < loreEntries.length - 1) {
    currentLorePage++;
    showLorePage();
  }
}

function prevLore() {
  if (currentLorePage > 0) {
    currentLorePage--;
    showLorePage();
  }
}

// --- Map System ---
function toggleMap() {
  if (mapViewerEl.classList.contains("hidden")) {
    mapViewerEl.classList.remove("hidden");
    renderMap();
  } else {
    mapViewerEl.classList.add("hidden");
  }
}

function renderMap() {
  // Simple ASCII-style map representation
  const mapLayout = `
Floor: ${currentFloor}
Room: ${currentRoom}

[Manager Office]──[Hallway]──[Storage]
      │            │
[Office Closet]  [Security]──[Maintenance]
      │            │
 [Workshop]     [Dormitory]─[Lab Storage]

Elevator: [B1] ${sub2Unlocked ? " [Sub2] " : ""}${g3Unlocked ? " [G3] " : ""}
(Use ${currentFloor === "B1" ? "a button in Security or Maintenance" : "the elevator panel"} to travel.)
  `;
  mapContentEl.textContent = mapLayout;
}

// --- Elevator System ---
function toggleElevatorPanel() {
  if (elevatorPanelEl.classList.contains("hidden")) {
    elevatorPanelEl.classList.remove("hidden");
  } else {
    elevatorPanelEl.classList.add("hidden");
  }
}

function callElevator() {
  if (currentFloor === "B1") {
    if (sub2Unlocked || g3Unlocked) {
      messageEl.textContent = "Elevator doors slide open. You step inside.";
      moveToElevator("B1");
    } else {
      messageEl.textContent = "The elevator is offline. You need to unlock other floors first.";
    }
  } else {
    messageEl.textContent = "The elevator doors slide open. You step inside.";
    moveToElevator(currentFloor);
  }
}

function moveToElevator(fromFloor) {
  // Hide room UI and show elevator choices
  hideAllScreens();
  elevatorPanelEl.classList.remove("hidden");
  elevatorPanelEl.innerHTML = `
    <p>Select Floor:</p>
    <button onclick="useElevator('B1')">B1</button>
    ${sub2Unlocked ? `<button onclick="useElevator('Sub2')">Sub2</button>` : ""}
    ${g3Unlocked ? `<button onclick="useElevator('G3')">G3</button>` : ""}
    <button onclick="exitElevator()">Exit Elevator</button>
  `;
}

function useElevator(targetFloor) {
  if (targetFloor === currentFloor) {
    messageEl.textContent = `You are already on ${targetFloor}.`;
    hideAllScreens();
    roomScreenEl.classList.remove("hidden");
    renderRoom();
    renderMap();
    return;
  }

  if (targetFloor === "Sub2" && !sub2Unlocked) {
    messageEl.textContent = "Sub2 access is locked.";
    return;
  }
  if (targetFloor === "G3" && !g3Unlocked) {
    messageEl.textContent = "G3 access is locked.";
    return;
  }

  // Move to the target floor's landing (for now, just place player in a placeholder room)
  currentFloor = targetFloor;
  currentRoom = targetFloor === "Sub2" ? "Sub2 Landing" :
                targetFloor === "G3" ? "G3 Landing" : "Manager Office";
  hideAllScreens();
  roomScreenEl.classList.remove("hidden");
  messageEl.textContent = `You arrive at ${currentRoom}.`;
  objectsContainerEl.innerHTML = ""; // Assume placeholder for new floors
  loreTabEl.classList.toggle("hidden", loreEntries.length === 0);
  mapTabEl.classList.remove("hidden");
  renderMap();
}

function exitElevator() {
  hideAllScreens();
  roomScreenEl.classList.remove("hidden");
  renderRoom();
  renderMap();
}

// --- Event Listeners for Lore Navigation ---
document.getElementById("loreNextBtn").onclick = nextLore;
document.getElementById("lorePrevBtn").onclick = prevLore;

// --- On Load: Show Title Screen ---
backToTitle();
// --- Main Menu Button Hooks ---
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("settingsBtn").addEventListener("click", openSettings);
document.getElementById("backBtn").addEventListener("click", backToTitle);