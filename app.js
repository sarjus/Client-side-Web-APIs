// API Key - In a real application, you would secure this
const API_KEY = 'AIzaSyA7_MEgq6EG0M2VZMc61ArFkaa6pmCpMmM'; // Replace with your actual API key

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsCount = document.getElementById('results-count');
const resultsContainer = document.getElementById('results-container');
const searchHistoryList = document.getElementById('search-history');
const clearHistoryButton = document.getElementById('clear-history');
const modal = document.getElementById('player-modal');
const closeButton = document.querySelector('.close-button');

// YouTube Player
let player;

// Load user preferences and search history from localStorage
const loadFromStorage = () => {
    // Load preferred result count
    const savedResultsCount = localStorage.getItem('resultsCount');
    if (savedResultsCount) {
        resultsCount.value = savedResultsCount;
    }

    // Load search history
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    renderSearchHistory(searchHistory);
};

// Save user preferences to localStorage
const saveResultsCount = (count) => {
    localStorage.setItem('resultsCount', count);
};

// Save search query to history
const saveSearchToHistory = (query) => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // Don't add duplicate entries
    if (!searchHistory.includes(query)) {
        // Limit history to 10 items
        if (searchHistory.length >= 10) {
            searchHistory.pop();
        }
        
        searchHistory.unshift(query);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory(searchHistory);
    }
};

// Render search history in the UI
const renderSearchHistory = (history) => {
    searchHistoryList.innerHTML = '';
    
    history.forEach(query => {
        const li = document.createElement('li');
        li.textContent = query;
        li.addEventListener('click', () => {
            searchInput.value = query;
            searchVideos(query);
        });
        searchHistoryList.appendChild(li);
    });
};

// Clear search history
const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    renderSearchHistory([]);
};

// Search for videos using YouTube Data API
const searchVideos = async (query) => {
    if (!query.trim()) return;
    
    resultsContainer.innerHTML = '<p>Loading...</p>';
    
    try {
        const maxResults = resultsCount.value;
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        renderResults(data.items);
        saveSearchToHistory(query);
    } catch (error) {
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('Error fetching videos:', error);
    }
};

// Render search results
const renderResults = (videos) => {
    resultsContainer.innerHTML = '';
    
    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }
    
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.dataset.videoId = video.id.videoId;
        
        videoCard.innerHTML = `
            <img class="thumbnail" src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
            <div class="video-info">
                <h3 class="video-title">${video.snippet.title}</h3>
                <p class="channel-name">${video.snippet.channelTitle}</p>
            </div>
        `;
        
        videoCard.addEventListener('click', () => {
            openVideoPlayer(video.id.videoId);
        });
        
        resultsContainer.appendChild(videoCard);
    });
};

// Initialize YouTube player
function onYouTubeIframeAPIReady() {
    // The API will call this function when the page has finished downloading
    // the JavaScript for the player API
    console.log('YouTube IFrame API Ready');
}

// Open video player modal
const openVideoPlayer = (videoId) => {
    modal.style.display = 'block';
    
    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('player', {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
            }
        });
    }
};

// Close modal and pause video
const closeVideoPlayer = () => {
    modal.style.display = 'none';
    if (player) {
        player.pauseVideo();
    }
};

// Event Listeners
searchButton.addEventListener('click', () => {
    searchVideos(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchVideos(searchInput.value);
    }
});

resultsCount.addEventListener('change', () => {
    saveResultsCount(resultsCount.value);
});

clearHistoryButton.addEventListener('click', clearSearchHistory);

closeButton.addEventListener('click', closeVideoPlayer);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeVideoPlayer();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', loadFromStorage);
