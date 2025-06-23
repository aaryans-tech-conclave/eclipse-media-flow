To Run this project locally
```sh
# Step 1: Install the necessary dependencies.
npm i

# Step 2: Start the development server with auto-reloading and an instant preview.
npm run dev
```
# Base Movie Attributes
Base Movie Attributes are attributes linked to the movie characteristic of the movie (non-variable), the following lists them and their relevance.
## Core Features

| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `movie_id` | `string` | `mv00001`, `mv00002`, ... | Auto-generated unique identifier for database operations and referencing |
| `title` | `string` | `"The Dark Knight"`, `"Parasite"`, ... | Movie title for user display and text-based recommendations |
| `release_year` | `int` | `1978` - `2023` | Release year for temporal analysis and trend identification |
| `release_month` | `int` | `1` - `12` | Release month for seasonal analysis and holiday movie identification |
| `runtime` | `int` | `76` - `209` (minutes) | Movie duration for user filtering and viewing time planning |
| `country` | `string` | `USA`, `UK`, `India`, `Japan`, ... | Production country for regional preferences and cultural filtering |
| `language` | `string` | `English`, `Hindi`, `Multilingual`, ... | Primary language for accessibility and cultural matching |
| `mpaa_rating` | `string` | `G`, `PG`, `PG-13`, `R`, `NC-17` | Content rating for age-appropriate filtering and parental controls |
| `primary_genre` | `string` | `Action`, `Drama`, `Comedy`, ... | Main genre for core recommendation algorithms |
| `secondary_genre` | `string` | `Thriller`, `Romance`, `SciFi`, ... | Secondary genre for enhanced recommendation accuracy |
| `theme` | `string` | `Love`, `Heroism`, `Survival`, ... | Central theme for emotional preference matching |

## Tag System

| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `tags` | `list[string]` | `["Oscar Winner", "Action", ...]` | Multi-valued tags from `assign_tags_to_movie()` function |
| `tags_str` | `string` | `"Oscar Winner;Action;Netflix"` | Semicolon-separated tags for database storage and CSV export |

## Tag Categories

### 🏆 **Award Tags**
- `Oscar Winner`, `Festival Favorite`
- **Usage:** Quality indicators and prestige-based recommendations

### 🎬 **Content Tags** 
- `Family Friendly`, `Graphic Violence`, `Strong Romance`
- **Usage:** Content filtering, parental controls, sensitivity warnings

### 🎭 **Production Tags**
- `Sequel`, `Remake`, `Based on Book`, `Independent Film`, `Biographical`, `Historical`
- **Usage:** Production type preferences and originality filtering

### 🌍 **Cultural Tags**
- `Bollywood`, `Tollywood`, `Regional Cinema`, `Anime`, `J-Drama`, `Samurai`
- **Usage:** Cultural content discovery and regional preferences

### 🎄 **Seasonal Tags**
- `Christmas`, `Halloween`, `Valentine`, `Easter`, `Thanksgiving`, `Diwali`, `Holi`
- **Usage:** Holiday recommendations and seasonal content curation

### 📺 **Platform Tags**
- `Netflix`, `Amazon Prime`, `Disney+`, `HBO Max`, `Hulu`, `Apple TV+`, `Peacock`
- **Usage:** Availability-based filtering and subscription-aware recommendations

## Dataset Summary
- **Size:** 100 movies (1978-2023)
- **Purpose:** Movie recommendation systems and content analysis
- **Features:** 12 core attributes + dynamic tagging system
- **Applications:** ML algorithms, filtering, personalization, content discovery
