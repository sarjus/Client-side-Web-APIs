# YouTube Video Search Application

This web application allows users to search for YouTube videos using the YouTube Data API and watch them using the YouTube IFrame Player API. It also implements client-side storage to save user preferences and search history.

## Features

- Search for YouTube videos
- Watch videos within the application
- Save search history
- Customize number of search results
- Responsive design

## Setup Instructions

1. Clone this repository
2. Get a YouTube Data API key from the [Google Developer Console](https://console.developers.google.com/)
3. Replace `YOUR_YOUTUBE_API_KEY` in `app.js` with your actual API key
4. Open `index.html` in your browser

## API Usage

### YouTube Data API

This application uses the YouTube Data API v3 to search for videos. The API is queried using the following endpoint:

```
https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${maxResults}&type=video&key=${API_KEY}
```

### YouTube IFrame Player API

The YouTube IFrame Player API is used to embed and play videos within the application.

## Client-Side Storage

This application uses localStorage to store:

- User's preferred number of search results
- Search history (limited to 10 items)

## Technologies Used

- HTML
- CSS
- JavaScript
- YouTube Data API
- YouTube IFrame Player API
- LocalStorage API
