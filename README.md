# Interactive Sticker Visualizer

**Demo**: [home](https://mule-fe-1027839195257.us-east4.run.app/), [existing session](https://mule-fe-1027839195257.us-east4.run.app/visualizer?sessionId=nuNP0Lyk)

## 🚨 Note to Sticker Mule Team (apologies for including this here 🙂)

While exploring the Sticker Mule site, I noticed a small glitch where the sticker size doesn’t update correctly when navigating between stickers—the display carries over from the previous item until the page is refreshed. From what I can tell, it may relate to React state not re-rendering properly during navigation.

I’m sorry to bring this up through the README, but I thought it might be helpful to share since I was already working on a related prototype.

📹 **Recording**: [View recorded demonstration on Google Drive](https://drive.google.com/file/d/1ZE9U00NlNE34DXNIpIgytBxwDZQegoar/view)

---

A Next.js application that allows users to visualize and arrange stickers on a MacBook Pro laptop. Users can create sessions, add multiple stickers, drag them around, and save their arrangements.

## Features

- **Session Management**: Create new sessions or load existing ones with 8-character session IDs
- **Drag & Drop**: Interactive sticker placement on a MacBook Pro mockup
- **Layer Management**: Reorder stickers (bring to front/send to back)
- **Session Saving**: Save sticker arrangements with positions
- **URL Sharing**: Copy session URLs to share configurations

## Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)
*Choose to enter an existing session ID or create a new session*

### Visualizer Interface
![Sticker Visualizer](screenshots/visualizer-main.png)
*Main visualizer interface showing stickers on MacBook Pro*

### Session Management
![Session Info](screenshots/session-info.png)
*Session ID display and URL copying functionality*

### Sticker Management
![Sticker Management](screenshots/sticker-management.png)
*Layer management and sticker controls*

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Go webserver
- **Styling**: Tailwind CSS
- **Deployment**: Docker + Google Cloud Platform
- **Database**: Postgresql

## Key Components

### Session Management
- **Session ID Generation**: 8-character alphanumeric IDs
- **URL Parameters**: Sessions accessible via `?sessionId=ABC123XY`
- **Persistence**: Save/load sticker arrangements

### Sticker Visualizer
- **Interactive Canvas**: MacBook Pro background with draggable stickers
- **Real-time Positioning**: Live coordinate tracking
- **Size Calculations**: Coverage percentage display
- **Layer Control**: Z-index management for overlapping stickers
