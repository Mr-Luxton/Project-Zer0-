let hasKey = false;
let deskUnlocked = false;
let hasBook = false;
let loreEntries = [];
let currentLorePage = 0;
let currentRoom = "Manager Office";
let currentLevel = "B1";

function startGame() {
  hideAllScreens();
  document.getElementById('room').classList.remove('hidden');
  document.getElementById('loreTab').classList.toggle('hidden', !hasBook);
  document.getElementById('mapTab').classList.remove('hidden');
}

function openSettings() {
  hideAllScreens();
  document.getElementById('settingsScreen').classList.remove('hidden');
}

function backToTitle() {
  hideAllScreens();
  document.getElementById('titleScreen').classList.remove('hidden');
}

function hideAllScreens() {
  document.getElementById('titleScreen').classList.add('hidden');
  document.getElementById('settingsScreen').classList.add('hidden');
  document.getElementById('room').classList.add('hidden');
  document.getElementById('loreBook').classList.add('hidden');
  document.getElementById('mapViewer').classList.add('hidden');
}

function inspect(item) {
  let msg = '';
  switch(item) {
    case 'closet':
      if (!hasKey) {
        msg = "Inside the closet, you find a small rusty key.";
        hasKey = true;
      } else {
        msg = "The closet is empty.";
      }
      break;

    case 'desk':
      if (!deskUnlocked) {
        if (hasKey) {
          msg = "You unlock the desk drawer and find a dusty book.";
          deskUnlocked = true;
          hasBook = true;
          document.getElementById('loreTab').classList.remove('hidden');
          addLore("You’ve found the ‘Zer0 Log’. Each page details past escapees — and their failures.");
        } else {
          msg = "The desk drawer is locked.";
        }
      } else {
        msg = "The desk is open. The book is gone.";
      }
      break;

    case 'door':
      let code = prompt("Enter 3-digit code:");
      if (code === "517") {
        msg = "The keypad clicks. The door opens to a dim hallway.";
        moveToRoom("Hallway");
      } else {
        msg = "Wrong code. Try again.";
      }
      break;

    case 'note':
      msg = "A crumpled note reads: 'Five. One. Seven. The key to freedom lies in the numbers we forget.'";
      addLore("The note is one of many left by Subject 4. Most didn't survive the first test.");
      break;

    case 'backToOffice':
      moveToRoom("Manager Office");
      return;

    case 'elevator':
      msg = "The elevator doesn't have power... yet.";
      break;
  }

  document.getElementById('message').textContent = msg;
}

function moveToRoom(roomName) {
  currentRoom = roomName;
  if (roomName === "Hallway") {
    document.getElementById('message').textContent = "You are now in the Hallway. It's quiet, but not safe.";
    document.getElementById('objects').innerHTML = `
      <button onclick="inspect('backToOffice')">Go Back</button>
      <button onclick="inspect('elevator')">Elevator</button>
    `;
  } else if (roomName === "Manager Office") {
    document.getElementById('message').textContent = "You return to the Manager's Office.";
    document.getElementById('objects').innerHTML = `
      <button onclick="inspect('closet')">Closet</button>
      <button onclick="inspect('desk')">Desk</button>
      <button onclick="inspect('door')">Door</button>
      <button onclick="inspect('note')">Loose Paper</button>
    `;
  }
  renderMap();
}

function toggleLore() {
  const loreBook = document.getElementById('loreBook');
  if (loreBook.classList.contains('hidden')) {
    loreBook.classList.remove('hidden');
    showLorePage();
  } else {
    loreBook.classList.add('hidden');
  }
}

function addLore(entry) {
  if (!loreEntries.includes(entry)) {
    loreEntries.push(entry);
  }
}

function showLorePage() {
  if (loreEntries.length > 0) {
    document.getElementById('lorePage').textContent = loreEntries[currentLorePage];
  } else {
    document.getElementById('lorePage').textContent = "You haven’t found any lore yet.";
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

function toggleMap() {
  const map = document.getElementById('mapViewer');
  if (map.classList.contains('hidden')) {
    map.classList.remove('hidden');
    renderMap();
  } else {
    map.classList.add('hidden');
  }
}

function renderMap() {
  const mapLayout = `
Level: ${currentLevel}
Room: ${currentRoom}

●──●──●
│     │
●    You
│
●──●──●

Rooms:
● = Room
You = Your Position
  `;
  document.getElementById('mapContent').textContent = mapLayout;
}
