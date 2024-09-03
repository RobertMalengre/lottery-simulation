document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid');
    const lockInButton = document.getElementById('lockIn');
    const playAgainButton = document.getElementById('playAgain');
    const clearGridButton = document.getElementById('clearGrid');
    const runSimulationButton = document.getElementById('runSimulation');
    const simulationCountInput = document.getElementById('simulationCount');
    const totalTimesPlayed = document.getElementById('totalTimesPlayed');
    const matchesStats = [
        document.getElementById('matches0'),
        document.getElementById('matches1'),
        document.getElementById('matches2'),
        document.getElementById('matches3'),
        document.getElementById('matches4'),
        document.getElementById('matches5'),
        document.getElementById('matches6')
    ];
    const choiceBalls = document.querySelectorAll('.choice-ball');

    const ROWS = 5;
    const COLS = 9;
    const MAX_CHOICES = 6;

    let selectedSquares = new Set();
    let isResultScreen = false;

    // Create the grid
    for (let i = 0; i < ROWS * COLS; i++) {
        const square = document.createElement('div');
        square.addEventListener('click', () => handleSquareClick(i));
        square.tabIndex = -1; // Prevents the caret from appearing when clicking the square
        gridContainer.appendChild(square);
    }

    function handleSquareClick(index) {
        if (isResultScreen) return;

        const square = gridContainer.children[index];
        if (selectedSquares.has(index)) {
            square.style.backgroundColor = 'white';
            selectedSquares.delete(index);
            updateRemainingChoices();
        } else if (selectedSquares.size < MAX_CHOICES) {
            square.style.backgroundColor = 'blue';
            selectedSquares.add(index);
            updateRemainingChoices();
        }

        lockInButton.disabled = selectedSquares.size !== MAX_CHOICES;
        runSimulationButton.disabled = selectedSquares.size !== MAX_CHOICES && !isResultScreen;
    }

    function updateRemainingChoices() {
        choiceBalls.forEach((ball, index) => {
            ball.classList.toggle('blue', index < MAX_CHOICES - selectedSquares.size);
        });
    }

    function lockIn() {
        if (selectedSquares.size !== MAX_CHOICES) return;

        isResultScreen = true;
        const randomSquares = generateRandomSquares(MAX_CHOICES);
        let matches = 0;

        for (let i = 0; i < ROWS * COLS; i++) {
            const square = gridContainer.children[i];
            if (selectedSquares.has(i) && randomSquares.has(i)) {
                square.style.backgroundColor = 'green';
                matches++;
            } else if (randomSquares.has(i)) {
                square.style.backgroundColor = 'red';
            } else if (selectedSquares.has(i)) {
                square.style.backgroundColor = 'blue'; // Keep the user's selection visible
            }
        }

        updateStats(matches);
        lockInButton.disabled = true;
        playAgainButton.disabled = false;
        clearGridButton.disabled = false;
        runSimulationButton.disabled = false;
    }

    function playAgain() {
        resetGrid(false);
        lockIn();
    }

    function clearGrid() {
        resetGrid(true);
        selectedSquares.clear();
        updateRemainingChoices();
        lockInButton.disabled = true;
        playAgainButton.disabled = true;
        clearGridButton.disabled = true;
        runSimulationButton.disabled = true;
        isResultScreen = false;
    }

    function resetGrid(clearSelections) {
        for (let i = 0; i < ROWS * COLS; i++) {
            const square = gridContainer.children[i];
            square.style.backgroundColor = clearSelections ? 'white' : (selectedSquares.has(i) ? 'blue' : 'white');
        }
    }

    function generateRandomSquares(count) {
        const selected = new Set();
        while (selected.size < count) {
            const randomIndex = Math.floor(Math.random() * (ROWS * COLS));
            selected.add(randomIndex);
        }
        return selected;
    }

    function updateStats(matches) {
        totalTimesPlayed.textContent = parseInt(totalTimesPlayed.textContent) + 1;
        matchesStats[matches].textContent = parseInt(matchesStats[matches].textContent) + 1;
    }

    function runSimulation() {
        let simulationCount = parseInt(simulationCountInput.value);

        // Ensure the value is a valid whole number between 1 and 1000
        if (isNaN(simulationCount) || simulationCount < 1 || simulationCount > 1000) {
            alert("Please enter a whole number between 1 and 1000.");
            return;
        }

        let intervalTime = simulationCount > 200 ? 40 : 100; // 0.04s for > 200, otherwise 0.1s
        let count = 0;

        const simulationInterval = setInterval(() => {
            if (count >= simulationCount) {
                clearInterval(simulationInterval);
                runSimulationButton.disabled = false;
                return;
            }
            playAgain();
            count++;
        }, intervalTime);

        runSimulationButton.disabled = true;
    }

    // Adding an event listener to restrict input to whole numbers between 1 and 1000
    simulationCountInput.addEventListener('input', () => {
        let value = parseInt(simulationCountInput.value);

        if (isNaN(value) || value < 1) {
            simulationCountInput.value = 1;
        } else if (value > 1000) {
            simulationCountInput.value = 1000;
        }
    });

    // Event listeners for buttons
    lockInButton.addEventListener('click', lockIn);
    playAgainButton.addEventListener('click', playAgain);
    clearGridButton.addEventListener('click', clearGrid);
    runSimulationButton.addEventListener('click', runSimulation);
});
