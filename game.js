let hasKey = false;
let deskUnlocked = false;
let hasBook = false;
let loreUnlocked = [];
let currentPage = 0;

function startGame() {
  hideAllScreens();
  document.getElementById('room').classList.remove('hidden');
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
  document.querySelectorAll("#titleScreen, #settingsScreen, #room").forEach(el => {
    el.classList.add('hidden');
  });
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
        msg = "The keypad clicks. The door swings open. You're free… for now.";
      } else {
        msg = "Wrong code. Try again.";
      }
      break;

    case 'note':
      msg = "A crumpled note reads: 'Five. One. Seven. The key to freedom lies in the numbers we forget.'";
      addLore("The note is one of many left by Subject 4. Most didn't survive the first test.");
      break;
  }

  document.getElementById('message').textContent = msg;
}

// LORE BOOK SYSTEM

function addLore(text) {
  if (!loreUnlocked.includes(text)) {
    loreUnlocked.push(text);
  }
  updateLorePage();
}

function toggleLoreBook() {
  const book = document.getElementById('loreBook');
  if (book.classList.contains('hidden')) {
    book.classList.remove('hidden');
    updateLorePage();
  } else {
    book.classList.add('hidden');
  }
}

function updateLorePage() {
  const content = loreUnlocked[currentPage] || "No entries yet.";
  document.getElementById('loreContent').textContent = content;
}

function nextPage() {
  if (currentPage < loreUnlocked.length - 1) {
    currentPage++;
    updateLorePage();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    updateLorePage();
  }
}
