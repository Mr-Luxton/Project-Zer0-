function startGame() {
  document.getElementById('titleScreen').classList.add('hidden');
  document.getElementById('settingsScreen').classList.add('hidden');
  document.getElementById('room').classList.remove('hidden');
}

function openSettings() {
  document.getElementById('titleScreen').classList.add('hidden');
  document.getElementById('settingsScreen').classList.remove('hidden');
}

function backToTitle() {
  document.getElementById('settingsScreen').classList.add('hidden');
  document.getElementById('titleScreen').classList.remove('hidden');
}

function inspect(item) {
  let msg = '';
  let loreBox = document.getElementById('lore');
  loreBox.classList.add('hidden');

  switch(item) {
    case 'desk':
      msg = "An old wooden desk. There's a locked drawer.";
      break;
    case 'door':
      msg = "A heavy door with a keypad. You need a 3-digit code.";
      let code = prompt("Enter code:");
      if (code === "517") {
        msg = "The keypad clicks. The door swings open. You're free… for now.";
      } else {
        msg = "Wrong code. Try again.";
      }
      break;
    case 'note':
      msg = "A crumpled note reads: 'Five. One. Seven. The key to freedom lies in the numbers we forget.'";
      loreBox.textContent = "LORE UNLOCKED: Zer0 was the last test subject... but what were the others?";
      loreBox.classList.remove('hidden');
      break;
  }

  document.getElementById('message').textContent = msg;
}
