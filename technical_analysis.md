# Technical Analysis: Carambole Game Tracking Web App

## 1. Overview
The goal is to migrate an existing Excel-based Carambole (billiards) tracking system to a modern web application. The app will allow referees to record turns, track scores, and view match summaries in real-time.

## 2. Data Model

### 2.1 Match (Wedstrijd)
A match consists of a series of games (typically 6, based on the Excel file).
- `id`: Unique identifier
- `date`: Date of the match
- `team_home`: Name of the home team
- `team_away`: Name of the away team
- `games`: List of Game entities

### 2.2 Game (Scoreblad)
Each game is a competition between two players.
- `id`: Unique identifier
- `player_home`: Player entity
- `player_away`: Player entity
- `target_score_home`: Points needed for home player (Sterktegetal)
- `target_score_away`: Points needed for away player (Sterktegetal)
- `max_turns`: Usually 20
- `turns`: List of Turn entities
- `status`: ongoing, finished

### 2.3 Player
- `name`: String
- `handicap/sterktegetal`: Default target score for this player

### 2.4 Turn
- `turn_number`: Integer
- `points_home`: Points scored by home player in this turn
- `points_away`: Points scored by away player in this turn

## 3. Business Logic & Calculations

### 3.1 Real-time Statistics
For each player in a game:
- **Total Score**: Sum of points across all turns.
- **Highest Series (Hoogste Serie)**: Maximum points scored in a single turn.
- **Misses (Poedels)**: Count of turns where 0 points were scored.
- **Average (Gemiddelde)**: Total Score / Number of Turns.
- **Match Points (Punten)**: `(Total Score / Target Score) * 10`. Note: If a player scores more than their target, the MP can exceed 10.00.

### 3.2 Game End Conditions
A game always lasts for exactly 20 innings (turns) for both players, regardless of the score.

## 4. User Interface Requirements

### 4.1 Referee View (Game Input)
- Simple, large buttons for point entry (0-9+).
- Real-time display of current score and target score.
- Turn counter.
- Undo button for last turn.

### 4.2 Match Overview (Dashboard)
- Summary table showing all 6 games.
- Total points for both teams.
- Navigation to individual game sheets.

### 4.3 Management View
- Ability to set up teams and player names before the match starts.
- Historical data view of previous matches.

## 5. Technical Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Modern CSS variables for easy theming)
- **Data Persistence**: Next.js API Routes with a local JSON-based storage (or SQLite for production) to replace the Excel file.
- **State Management**: React Context for real-time game state during a match.
