let savedCardsModal;
let createCardModal;

(function () {
  // Wait for the DOM to fully load before running scripts
  document.addEventListener('DOMContentLoaded', () => {
    initPage();

    // Event listener for the "Create New Bingo Card" button
    const createBtn = document.getElementById('create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      saveTilePool(); // Call the function to save the tile pool
      createCardModal.show();
    });
  }

    // Initialize Bootstrap modals
    const editModalElement = document.getElementById('modal');
    let editModal;
    if (editModalElement) {
      editModal = new bootstrap.Modal(editModalElement);
    }

    const savedCardsModalElement = document.getElementById('saved-cards-modal');
    if (savedCardsModalElement) {
      savedCardsModal = new bootstrap.Modal(savedCardsModalElement);
    }

    const createCardModalElement = document.getElementById('create-card-modal');
    if (createCardModalElement) {
      createCardModal = new bootstrap.Modal(createCardModalElement);
    } 

    // Event listener for the "Create" button in the Create Card Modal
    const createCardBtn = document.getElementById('create-card-btn');
      if (createCardBtn) {
      createCardBtn.addEventListener('click', () => {
        saveWords();
        createCardModal.hide();
      });
    }

    // Attach event listener to the bingo board using event delegation
    const bingoBoard = document.getElementById('bingo-board');
    if (bingoBoard) {
      bingoBoard.addEventListener('click', (event) => {
        const cell = event.target;
        if (cell.classList.contains('bingo-cell')) {
          cell.classList.toggle('marked');
          checkBingoWin();
        }
      });
    }

    // Event listener for the "Edit Words" button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn && editModal) {
      editBtn.addEventListener('click', () => {
        editModal.show();
      });
    }

    // Event listener for the "Save" button in the Edit Modal
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn && editModal) {
      saveBtn.addEventListener('click', () => {
        saveWords();
        editModal.hide();
      });
    }

    // Event listener for the "Print" button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Event listener for the "View Saved Cards" button
    const viewSavedBtn = document.getElementById('view-saved-btn');
    if (viewSavedBtn && savedCardsModal) {
      viewSavedBtn.addEventListener('click', () => {
        displaySavedCards(); // Function to populate the saved cards list
        savedCardsModal.show();
      });
    }

    // Event listener for the "Save Bingo Card" button
    const saveCardBtn = document.getElementById('save-card-btn');
    if (saveCardBtn) {
      saveCardBtn.addEventListener('click', () => {
        saveCurrentBingoCard();
      });
    }
  });

  // Function to generate the bingo card
  function generateBingoCard(input) {
    const bingoBoard = document.getElementById('bingo-board');
    bingoBoard.innerHTML = ''; // Clear previous cells

    let grid = [];

    if (Array.isArray(input)) {
      // Input is an array of words
      let words = input.slice(0, 24); // Get the first 24 words
      words.splice(12, 0, 'FREE'); // Insert 'FREE' at the center
      grid = words.map((word) => ({ content: word }));
    } else if (input && Array.isArray(input.grid)) {
      // Input is an object with a grid property from the server
      grid = input.grid;
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

   // Function to save words from the modal input and update the bingo card
  function saveWords() {
    const inputText = document.getElementById('create-card-input').value.trim();
      if (inputText !== '') {
    // Split input by new lines and trim each word
      const words = inputText
        .split('\n')
        .map((word) => word.trim())
        .filter((word) => word !== '');

      if (words.length < 24) {
        alert('Please enter at least 24 words.');
        return;
    }

     generateBingoCard(words);
    } else {
      // If input is empty, fetch a random bingo card
      fetchBingoCard();
    } 
    document.getElementById('create-card-input').value = ''; // Clear the input
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

  // Function to save the current bingo card
  function saveCurrentBingoCard() {
    const bingoCells = document.querySelectorAll('.bingo-cell');
    const cardData = Array.from(bingoCells, (cell) => cell.textContent);

    // Get existing saved cards from localStorage
    let savedCards = JSON.parse(localStorage.getItem('savedBingoCards')) || [];

    // Implement a limit on the number of saved cards
    const maxCards = 50;
    if (savedCards.length >= maxCards) {
      savedCards.shift(); // Remove the oldest card
    }

    // Save the new card
    savedCards.push(cardData);
    localStorage.setItem('savedBingoCards', JSON.stringify(savedCards));

    alert('Bingo card saved successfully!');
  }

  // Function to display saved bingo cards in the modal
  function displaySavedCards() {
    const savedCardsList = document.getElementById('saved-cards-list');
    if (!savedCardsList) return;
    savedCardsList.innerHTML = ''; // Clear previous list

    let savedCards = JSON.parse(localStorage.getItem('savedBingoCards')) || [];

    if (savedCards.length === 0) {
      savedCardsList.innerHTML = '<li class="list-group-item">No saved bingo cards.</li>';
      return;
    }

    savedCards.forEach((card, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Bingo Card ${index + 1}`;
      listItem.classList.add('list-group-item');
      listItem.style.cursor = 'pointer';
      listItem.addEventListener('click', () => {
        loadBingoCard(card);
        savedCardsModal.hide();
        showBingoSection();
      });
      savedCardsList.appendChild(listItem);
    });
  }

  // Function to load a bingo card
  function loadBingoCard(cardData) {
    const grid = cardData.map((content) => ({ content }));
    generateBingoCard(grid); // Generate the bingo board with the loaded card data
  }

  // Initialize the page
  function initPage() {
    // Show the welcome section and hide the bingo section
    const welcomeSection = document.getElementById('welcome-section');
    if (welcomeSection) {
      welcomeSection.style.display = 'block';
    }
    const bingoSection = document.getElementById('bingo-section');
    if (bingoSection) {
      bingoSection.style.display = 'none';
    }
  }

  // Function to check for a bingo win
  function checkBingoWin() {
    const bingoCells = document.querySelectorAll('.bingo-cell');
    const size = 5; // Assuming a 5x5 bingo grid
    let cellArray = [];

    // Convert NodeList to a 2D array representing the bingo grid
    for (let i = 0; i < size; i++) {
      cellArray[i] = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        cellArray[i][j] = bingoCells[index].classList.contains('marked');
      }
    }

    // Check rows and columns
    for (let i = 0; i < size; i++) {
      let rowWin = true;
      let colWin = true;

      for (let j = 0; j < size; j++) {
        // Check row
        if (!cellArray[i][j]) {
          rowWin = false;
        }
        // Check column
        if (!cellArray[j][i]) {
          colWin = false;
        }
      }

      if (rowWin || colWin) {
        displayWinMessage();
        return;
      }
    }

    // Check diagonals
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

  function displayWinMessage() {
    alert('BINGO! You have a winning card!');
  }

  // Function to fetch a random bingo card from the server
  async function fetchBingoCard(tilepoolId = 'nouns') {
    // Use the provided tilepoolId or default to 'nouns'
    const size = 5; // Size of the bingo card
    const seed = Math.floor(Math.random() * 10000); // Random seed
  
    try {
      const response = await fetch(
        `/api/v1/bingocard/${tilepoolId}?size=${size}&seed=${seed}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch bingo card');
      }
      const data = await response.json();
      generateBingoCard(data); // Pass the entire data object
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching the bingo card. Please try again later.');
    }
  }
  

  async function saveTilePool() {
    const inputText = document.getElementById('create-card-input').value.trim();
    if (inputText !== '') {
      const words = inputText
        .split('\n')
        .map((word) => word.trim())
        .filter((word) => word !== '');
  
      if (words.length < 24) {
        alert('Please enter at least 24 words.');
        return;
      }
  
      // Construct the tiles data
      const tiles = words.map((word) => {
        return {
          content: word,
          tags: [], // tags if necessary
          image: null // URL if necessary
        };
      });
  
      // Prepare the data to be sent to the server
      const data = {
        name: 'Custom Tile Pool', // we can add a name input field in the modal if needed
        tiles: tiles,
      };
  
      try {
        const response = await fetch('/tilepools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (!response.ok) {
          throw new Error(`Failed to create tile pool: ${response.statusText}`);
        }
  
        const result = await response.json();
        const tilepoolId = result.id;
        // Generate the bingo card using the new tile pool
        fetchBingoCard(tilepoolId);
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the tile pool. Please try again later.');
      }
    } else {
      // If input is empty, fetch a random bingo card
      fetchBingoCard();
    }
    document.getElementById('create-card-input').value = ''; // Clear the input
  }
  
})();
