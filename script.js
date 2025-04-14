document.addEventListener('DOMContentLoaded', function() {
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
    
    // Show images container
    document.getElementById('images-container').style.display = 'flex';

});
 const gameState = {
    config: null,
    foundDifferences: [],
    startTime: null,
    timerInterval: null,
    gameCompleted: false
};

// DOM elements
const elements = {
    gameTitle: document.getElementById('game-title'),
    imagesContainer: document.getElementById('images-container'),
    image1: document.getElementById('image1'),
    image2: document.getElementById('image2'),
    scoreDisplay: document.getElementById('score'),
    totalDifferences: document.getElementById('total-differences'),
    timeDisplay: document.getElementById('time'),
    messageBox: document.getElementById('message'),
    resetBtn: document.getElementById('reset-btn'),
    loading: document.getElementById('loading')
};

// Audio elements
const sounds = {
    success: new Audio('sounds/success.mp3'),
    click: new Audio('sounds/click.mp3'),
    win: new Audio('sounds/violin-win.mp3')
};

// Load game configuration from JSON file
async function loadGameConfig() {
    try {
        // In a real application, you would load from an actual JSON file
        // For this example, we'll use a hardcoded JSON object
        const config = {
            "gameTitle": "Spot the Difference - Jungle Scene",
            "images": {
                "image1": "imageM21.jpg",
                "image2": "imageM22.jpg"
            },
            "differences": [
                { "x": 98, "y": 18, "width": 40, "height": 40 }, //branch
                { "x": 145, "y": 71, "width": 30, "height": 30 }, //cloud
                { "x": 253, "y": 40, "width": 35, "height": 35 }, //leaf
                { "x": 213, "y": 129, "width": 45, "height": 45 }, //apple
                { "x": 163, "y": 339, "width": 25, "height": 25 } //daisy
            ]
        };
        
        return config;
        
        // In a real application, you would use something like:
        // const response = await fetch('game-config.json');
        // return await response.json();
    } catch (error) {
        console.error('Error loading game configuration:', error);
        elements.messageBox.textContent = 'Failed to load game configuration.';
        elements.messageBox.style.display = 'block';
        elements.messageBox.className = 'message error';
        return null;
    }
}

// Initialize the game
async function initGame() {
    // Load game configuration

    gameState.config = await loadGameConfig();
    if (!gameState.config) return;
    
    // Set game title
    elements.gameTitle.textContent = gameState.config.gameTitle;
    
    // Load images
    elements.image1.src = gameState.config.images.image1;
    elements.image2.src = gameState.config.images.image2;
    
    // Wait for images to load
    await Promise.all([
        new Promise(resolve => elements.image1.onload = resolve),
        new Promise(resolve => elements.image2.onload = resolve)
    ]);
    
    // Hide loading indicator and show images
    elements.loading.style.display = 'none';
    elements.imagesContainer.style.display = 'flex';
    
    // Update total differences counter
    elements.totalDifferences.textContent = gameState.config.differences.length;
    
    // Add event listeners to images
    elements.image1.addEventListener('click', handleImageClick);
    elements.image2.addEventListener('click', handleImageClick);
    
    // Start timer
    startTimer();
}

// Handle image clicks
function handleImageClick(event) {
    if (gameState.gameCompleted) return;
    
    // Get click coordinates relative to the image
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if click is within any difference area
    const imageIndex = event.target.id === 'image1' ? 0 : 1;
    checkDifference(x, y, imageIndex);
}

// Check if click is within a difference area
function checkDifference(x, y, imageIndex) {
    const differences = gameState.config.differences;
    
    for (let i = 0; i < differences.length; i++) {
        const diff = differences[i];
        
        // Check if this difference was already found
        if (gameState.foundDifferences.includes(i)) continue;
        
        // Check if click is within the difference area
        if (
            x >= diff.x - 15 && 
            x <= diff.x + diff.width + 15 && 
            y >= diff.y - 15 && 
            y <= diff.y + diff.height + 15
        ) {
            // Mark difference as found
            gameState.foundDifferences.push(i);
            
            // Play click sound
            sounds.click.play();
            
            // Add markers to both images
            addDifferenceMarker(diff, 0);
            addDifferenceMarker(diff, 1);
            
            // Update score
            updateScore();
            return;
        }
    }
}

// Add marker to highlight found difference
function addDifferenceMarker(diff, imageIndex) {
    const marker = document.createElement('div');
    marker.className = 'difference-marker';
    marker.style.left = `${diff.x - 5}px`;
    marker.style.top = `${diff.y - 5}px`;
    marker.style.width = `${diff.width + 10}px`;
    marker.style.height = `${diff.height + 10}px`;
    
    const imageContainer = elements.imagesContainer.children[imageIndex];
    imageContainer.appendChild(marker);
}

// Update score display
function updateScore() {
    elements.scoreDisplay.textContent = gameState.foundDifferences.length;
    
    // Check if all differences are found
    if (gameState.foundDifferences.length === gameState.config.differences.length) {
        gameCompleted();
    }
}

// Start the timer
function startTimer() {
    gameState.startTime = new Date();
    
    gameState.timerInterval = setInterval(() => {
        const elapsed = new Date() - gameState.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        elements.timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// Handle game completion
function gameCompleted() {
    gameState.gameCompleted = true;
    clearInterval(gameState.timerInterval);
    
    // Play win sound
    sounds.win.play();
    
    // Display success message
    const time = elements.timeDisplay.textContent;
    elements.messageBox.textContent = `Congratulations! You found all ${gameState.config.differences.length} differences in ${time}!`;
    elements.messageBox.style.display = 'block';
    elements.messageBox.className = 'message success';
    
    // Add success animation to markers
    const markers = document.querySelectorAll('.difference-marker');
    markers.forEach(marker => {
        marker.style.borderColor = '#2ecc71';
    });
}

// Reset the game
function resetGame() {
    
    gameState.foundDifferences = [];
    
    
    const markers = document.querySelectorAll('.difference-marker');
    markers.forEach(marker => marker.remove());
    
    
    elements.scoreDisplay.textContent = '0';

    elements.messageBox.style.display = 'none';
    

    clearInterval(gameState.timerInterval);
    elements.timeDisplay.textContent = '00:00';
    
    gameState.gameCompleted = false;
    

    startTimer();
}



// Add event listeners
elements.resetBtn.addEventListener('click', resetGame);


document.addEventListener('DOMContentLoaded', initGame);