let createTilesetModal;
let currentTilePoolName = null; 



// functionality
// * bingo game
// * tilepool creation/selection

const modals = {
    savedCard: 'saved-cards-modal',
    createTilepool: null,
    edit: null
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const saveBtn = document.getElementById('save-btn');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    saveWords();
    editModal.hide();
  });
}



function initModals() {
    // create bootstrap modals
    modals.createTilepool = new bootstrap.Modal(document.getElementById('createTilesetModal'));
    modals.savedCard = new bootstrap.Modal(document.getElementById('saved-cards-modal'));
  
    // add event listeners
    //
    document.getElementById('create-btn')
        .addEventListener('click', () => {
            modals.createTilepool.show();
        });

    document.getElementById('save-btn')
        .addEventListener('click', () => {
            saveWords();
            modals.edit.hide();
        });


}

function login() {
  window.location.href = `${cognito_ip}/login`;
}

// Done: new tilepool form
const tilesetTilesInput = document.getElementById('tileset-tiles');
const numberedTilesDiv = document.getElementById('numbered-tiles');

tilesetTilesInput.addEventListener('input', () => {
  const tiles = tilesetTilesInput.value.split('\n').map(tile => tile.trim()).filter(tile => tile !== '');
  numberedTilesDiv.innerHTML = '';
  tiles.forEach((tile, index) => {
    const tileElement = document.createElement('div');
    tileElement.textContent = `${index + 1}. ${tile}`;
    numberedTilesDiv.appendChild(tileElement);
  });
});
document.getElementById('createTilesetForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const tilesetName = document.getElementById('tileset-name').value.trim();
  const tilesetTiles = document.getElementById('tileset-tiles').value.trim();

  if (!tilesetName || !tilesetTiles) {
    alert('Please provide a name and tiles for the tile pool.');
    return;
  }

  const printBtn = document.getElementById('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

  const tiles = tilesetTiles
    .split('\n')
    .map(tile => tile.trim())
    .filter(tile => tile !== '');

  if (tiles.length < 24) {
    alert('Please enter at least 24 tiles.');
    return;
  }

  const newTilePool = {
    name: tilesetName,
    tiles: tiles.map(tile => ({ type: 'text', content: tile, tags: [] })),
    free_tile: {
      type: 'text',
      content: 'FREE',
      tags: [],
    },
  };

  await createNewTileset(newTilePool);
});


  // Function to show the bingo section and hide the welcome section
  function showBingoSection() {
    const welcomeSection = document.getElementById('welcome-section');
    if (welcomeSection) {
      welcomeSection.style.display = 'none';
    }
    const bingoSection = document.getElementById('bingo-section');
    if (bingoSection) {
      bingoSection.style.display = 'block';
    }
  }




(function () {
  // Wait for the DOM to fully load before running scripts
  document.addEventListener('DOMContentLoaded', async () => {
    await initPage();

    document.getElementById('login-btn').addEventListener('click', login);

    // Initialize Bootstrap modals
    initModals();

      document.getElementById('createTilesetForm')
          .addEventListener('submit', async (event) => {
              event.preventDefault();

              const tilesetName = document.getElementById('tileset-name').value.trim();
              const tilesetTiles = document.getElementById('tileset-tiles').value.trim();

              if (!tilesetName || !tilesetTiles) {
                  alert('Please provide a name and tiles for the tile pool.');
                  return;
              }

              const tiles = tilesetTiles
                  .split('\n')
                  .map(tile => tile.trim())
                  .filter(tile => tile !== '');

              if (tiles.length < 24) {
                  alert('Please enter at least 24 tiles.');
                  return;
              }

              const newTilePool = {
                  name: tilesetName,
                  tiles: tiles.map(tile => ({ type: 'text', content: tile, tags: [] })),
                  free_tile: {
                      type: 'text',
                      content: 'FREE',
                      tags: []
                  }
              };
              await createNewTileset(newTilePool);
              createTilesetModal.hide();
          });

      document.getElementById('print-btn')
          .addEventListener('click', () => {
              window.print();
          });

      
      document.getElementById('view-saved-btn').addEventListener('click', () => {
          console.log('View Saved Cards clicked');
          displaySavedCards();
          modals.savedCard.show();
          });

      document.getElementById('bingo-board')
          .addEventListener('click', (event) => {
              const cell = event.target;
              if (cell.classList.contains('bingo-cell')) {
                  cell.classList.toggle('marked');
                  checkBingoWin();
              }
          });
  });
  
  function saveCurrentBingoCard() {
    const bingoCells = document.querySelectorAll('.bingo-cell');
    const cardData = Array.from(bingoCells, (cell) => cell.textContent);
  
    let cardName = prompt('Enter a name for this bingo card:');
    if (!cardName) {
      cardName = 'Untitled Card';
    }
  
    let savedCards = JSON.parse(localStorage.getItem('savedBingoCards')) || [];
  
    const maxCards = 50;
    if (savedCards.length >= maxCards) {
      savedCards.shift();
    }
  
    savedCards.push({
      name: cardName,
      data: cardData,
    });
  
    localStorage.setItem('savedBingoCards', JSON.stringify(savedCards));
    alert(`Bingo card "${cardName}" saved successfully!`);
  }

  function generateBingoCard(data) {
    const bingoBoard = document.getElementById('bingo-board');
    bingoBoard.innerHTML = ''; // Clear previous cells
  
    let grid = [];
  
    if (Array.isArray(data)) {
      // Input is an array of words
      let words = data.slice(0, 24);
      words.splice(12, 0, 'FREE'); // Insert 'FREE' at the center
      grid = words.map((word) => ({ content: word }));
    } else if (data && Array.isArray(data.tiles)) {
      grid = data.tiles.slice(0, 25); // Ensure exactly 25 tiles
    } else if (data && Array.isArray(data.grid)) {
      grid = data.grid.slice(0, 25); // Ensure exactly 25 tiles
    } else {
      console.error('Invalid input for generateBingoCard');
      return;
    }
  
    // Generate the bingo board
    grid.forEach((tile, index) => {
      const cell = document.createElement('div');
      cell.className = 'col bingo-cell';
      cell.textContent = tile.content || tile; // Handle both object and string types
  
      if (tile.content === 'FREE' || tile === 'FREE') {
        cell.classList.add('free-cell', 'marked');
      }
  
      bingoBoard.appendChild(cell);
    });
  
    showBingoSection();
  }
  
  // Update the click handler to use event delegation
  document.addEventListener('DOMContentLoaded', () => {
    const bingoBoard = document.getElementById('bingo-board');
    
    bingoBoard.addEventListener('click', (event) => {
      const cell = event.target;
      if (cell.classList.contains('bingo-cell') && !cell.classList.contains('free-cell')) {
        cell.classList.toggle('marked');
        checkBingoWin();
      }
    });
  });

  const saveCardBtn = document.getElementById('save-card-btn');
    if (saveCardBtn) {
      saveCardBtn.addEventListener('click', () => {
        saveCurrentBingoCard();
      });
    }


async function fetchAndGenerateBingoCard(tilepoolId, size, seed) {
  try {
    const bingocard = await getBingoCard(tilepoolId, size, seed);
    generateBingoCard(bingocard);
  } catch (error) {
    console.error('Error fetching or generating bingo card:', error);
  }
}

  // Function to show the bingo section and hide the welcome section
  function showBingoSection() {
    const welcomeSection = document.getElementById('welcome-section');
    if (welcomeSection) {
      welcomeSection.style.display = 'none';
    }
    const bingoSection = document.getElementById('bingo-section');
    if (bingoSection) {
      bingoSection.style.display = 'block';
    }
  }
  

  
  async function initPage() {
    // Show the welcome section and hide the bingo section

    const tilepoolId = getQueryParam('tilepoolId');

    if (tilepoolId) {
      // Use the tilepoolId from the URL to fetch and generate the bingo card
      await fetchAndGenerateBingoCard(tilepoolId, 5);
    } else {
      const welcomeSection = document.getElementById('welcome-section');
      if (welcomeSection) {
        welcomeSection.style.display = 'block';
      }
      const bingoSection = document.getElementById('bingo-section');
      if (bingoSection) {
        bingoSection.style.display = 'none';
      }
    }
  }

  function displaySavedCards() {
    const savedCardsList = document.getElementById('saved-cards-list');
    if (!savedCardsList) return;
  
    savedCardsList.innerHTML = ''; // Clear previous list
  
    // Retrieve saved cards from local storage
    let savedCards = JSON.parse(localStorage.getItem('savedBingoCards')) || [];
    console.log('Saved Cards:', savedCards);
  
    if (savedCards.length === 0) {
      savedCardsList.innerHTML = '<li class="list-group-item">No saved bingo cards.</li>';
      return;
    }
  
    savedCards.forEach((card, index) => {
      const cardName = card.name || `Bingo Card ${index + 1}`; // Use card name or default
  
      const listItem = document.createElement('li');
      listItem.textContent = cardName;
      listItem.classList.add('list-group-item');
      listItem.style.cursor = 'pointer';
  
      // Add event listener to load the clicked card
      listItem.addEventListener('click', () => {
        loadBingoCard(card);
        modals.savedCard.hide();
        showBingoSection();
      });
  
      savedCardsList.appendChild(listItem);
    });
  }

  function loadBingoCard(card) {
    const cardData = card.data || card; // Handle both new and old formats
    const grid = cardData.map((content) => ({ content }));
    generateBingoCard({ tiles: grid }); // Generate the bingo board with the loaded card data
  
    // Set currentTilePoolName if available
    currentTilePoolName = card.name || null;
  }

  // Function to create a new tile pool via the API
  async function createNewTileset(tileset) {
    try {
      const response = await fetch(`${server_ip}/tilepools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tileset),
      });
      if (!response.ok) {
        throw new Error('Failed to create tile pool');
      }
      const data = await response.json();
      alert('Tile pool created successfully!');
      console.log('Created Tile Pool:', data);
  
      // Fetch and generate the bingo card using the new tile pool
      await fetchAndGenerateBingoCard(data.id, 5);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the tile pool. Please try again later.');
    }
  }
    
  window.createNewTileset = createNewTileset;

  function checkBingoWin() {
    const bingoCells = document.querySelectorAll('.bingo-cell');
    const size = 5; // Assuming a 5x5 bingo grid
    let cellArray = [];

    for (let i = 0; i < size; i++) {
      cellArray[i] = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        cellArray[i][j] = bingoCells[index].classList.contains('marked');
      }
    }
    for (let i = 0; i < size; i++) {
      let rowWin = true;
      let colWin = true;

      for (let j = 0; j < size; j++) {
        if (!cellArray[i][j]) {
          rowWin = false;
        }
        if (!cellArray[j][i]) {
          colWin = false;
        }
      }
      if (rowWin || colWin) {
        displayWinMessage();
        return;
      }
    }
    let diagWin1 = true;
    let diagWin2 = true;
    for (let i = 0; i < size; i++) {
      if (!cellArray[i][i]) {
        diagWin1 = false;
      }
      if (!cellArray[i][size - i - 1]) {
        diagWin2 = false;
      }
    }

    if (diagWin1 || diagWin2) {
      displayWinMessage();
      return;
    }
  }

  // Function to display a win message
  function displayWinMessage() {
    alert('BINGO! You have a winning card!');
  }



})();
