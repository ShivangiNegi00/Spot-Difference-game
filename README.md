# Spot the Difference Game

A web-based "Spot the Difference" game that loads configuration from a JSON file, allowing easy customization of images and difference locations.

## Features

- Two images displayed side-by-side
- Click on differences to mark them
- Score tracking and timer
- Responsive design for desktop and mobile devices
- Sound effects for interactions
- Dynamic loading of game content from JSON configuration

## How to Play

1. Examine both images carefully to find differences between them
2. Click on any difference you spot
3. A circular marker will highlight each found difference
4. Find all differences to complete the game
5. Try to beat your best time!

## Understanding the JSON Configuration

The game uses a `game-config.json` file to dynamically load game content. This allows you to change images and difference locations without modifying the code.

### JSON Structure

```json
{
  "gameTitle": "Spot the Difference - Forest Scene",
  "images": {
    "image1": "images/imageM21.jpg",
    "image2": "images/imageM22.jpg"
  },
  "differences": [
    { "x": 120, "y": 50, "width": 30, "height": 30 },
    { "x": 250, "y": 150, "width": 25, "height": 25 },
    { "x": 400, "y": 200, "width": 35, "height": 35 },
    { "x": 150, "y": 300, "width": 45, "height": 45 },
    { "x": 500, "y": 100, "width": 25, "height": 25 }
  ]
}
