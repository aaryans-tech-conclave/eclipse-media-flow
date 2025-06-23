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

# Synthetic Dataset Features Analysis

## Movie Features

### **Core Metadata**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `title_sentiment` | `float` | `-1.0` to `1.0` | TextBlob sentiment analysis of movie titles for emotional matching |
| `release_season` | `string` | `Winter`, `Spring`, `Summer`, `Fall` | Season-based content categorization for temporal recommendations |
| `days_since_release` | `int` | `0` - `16000+` | Days elapsed since release for freshness scoring |
| `decay_factor` | `float` | `0.1` - `1.0` | Exponential decay based on age for relevance weighting |
| `is_new_release` | `int` | `0`, `1` | Binary flag for movies released within 90 days |

### **Content Analysis**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `violence_level` | `float` | `0.0` - `1.0` | Beta distribution content rating for violence filtering |
| `romance_level` | `float` | `0.0` - `1.0` | Romance content intensity for mood-based recommendations |
| `humor_level` | `float` | `0.0` - `1.0` | Comedy content analysis for genre refinement |
| `complexity_score` | `float` | `0.0` - `1.0` | Narrative complexity for user preference matching |
| `family_friendly` | `int` | `0`, `1` | G/PG rating indicator for parental controls |
| `cultural_specificity` | `float` | `0.0` - `1.0` | Non-US content cultural relevance score |

### **Holiday & Seasonal**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `holiday_boost` | `float` | `0.1` - `1.0` | Maximum holiday relevance score across all holidays |
| `holiday_Christmas` | `float` | `0.0` - `0.8` | Christmas content relevance based on release timing |
| `holiday_Halloween` | `float` | `0.0` - `0.7` | Halloween content relevance for October releases |
| `holiday_Diwali` | `float` | `0.0` - `0.9` | Indian festival relevance for regional content |
| `holiday_Valentine` | `float` | `0.0` - `0.7` | Valentine's Day romance content scoring |
| `weather_affinity` | `string` | `Sunny`, `Rainy`, `Snowy`, `Cloudy`, `Windy` | Weather-based viewing context matching |

### **Popularity & Engagement**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `avg_rating` | `float` | `1.0` - `10.0` | Simulated average user rating with normal distribution |
| `rating_count` | `int` | `0` - `500000+` | Number of ratings using Pareto distribution |
| `box_office` | `float` | `0.0` - `1000+` | Box office performance in millions (exponential distribution) |
| `rewatch_score` | `float` | `0.0` - `1.0` | Rewatchability factor for recommendation persistence |
| `critical_acclaim` | `float` | `0.0` - `1.0` | Critics' reception score for quality filtering |
| `award_nominations` | `int` | `0` - `50+` | Number of award nominations for prestige indicators |
| `imdb_rank` | `int/null` | `1` - `10000` | IMDb ranking position (70% of movies have rankings) |

### **Trend-Aware Features**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `current_event_relevance` | `float` | `0.0` - `1.0` | Keyword matching with current events for trending content |
| `trending_score` | `float` | `0.0` - `1.0` | Simulated social media trending factor with viral boosts |
| `social_media_mentions` | `int` | `0` - `50000+` | Social media activity derived from ratings and trends |
| `search_volume` | `int` | `0` - `100000+` | Search interest based on event relevance |
| `viral_potential` | `float` | `0.0` - `1.0` | Composite viral content scoring |

### **Composite Scores**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `engagement_score` | `float` | `0.0` - `1.0` | Weighted combination of ratings, box office, rewatch, and trends |
| `rewatchability` | `float` | `0.0` - `1.0` | Composite of rewatch score, mood intensity, and sentiment |
| `mood_intensity` | `float` | `0.0` - `1.0` | Emotional impact rating for mood-based filtering |

## User Features

### **Demographics**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `user_id` | `string` | `user_12345678` | UUID-based unique identifier for user tracking |
| `age` | `int` | `18` - `70` | User age for demographic-based recommendations |
| `gender` | `string` | `Male`, `Female`, `Other` | Gender identity for content personalization |
| `country` | `string` | `USA`, `UK`, `India`, `Japan`, etc. | Geographic location for regional content |
| `state` | `string` | `NY`, `CA`, `Maharashtra`, etc. | State/region for localized recommendations |
| `city` | `string` | `New York`, `Mumbai`, `Tokyo`, etc. | City-level geographic targeting |
| `timezone` | `int` | `-12` to `+10` | Timezone offset for temporal recommendation timing |

### **Viewing Behavior**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `genre_affinity` | `string` | `Action`, `Drama`, `Comedy`, etc. | Primary genre preference from Dirichlet distribution |
| `completion_rate` | `float` | `0.0` - `1.0` | Beta distribution of content completion patterns |
| `binge_score` | `float` | `0.0` - `1.0` | Tendency for binge-watching behavior |
| `rewatch_ratio` | `float` | `0.0` - `1.0` | Frequency of rewatching content |
| `rating_frequency` | `float` | `0.0` - `1.0` | How often user rates watched content |
| `autoplay_acceptance` | `float` | `0.0` - `1.0` | Acceptance rate of autoplay recommendations |
| `search_usage` | `float` | `0.0` - `1.0` | Frequency of using search vs discovery |
| `content_diversity` | `float` | `0.0` - `1.0` | Genre diversity preference (1 - max genre weight) |

### **Contextual Preferences**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `current_mood` | `string` | `Happy`, `Sad`, `Stressed`, `Relaxed`, etc. | Current emotional state for mood matching |
| `weather` | `string` | `Sunny`, `Rainy`, `Snowy`, etc. | Current weather for contextual recommendations |
| `season` | `string` | `Winter`, `Spring`, `Summer`, `Fall` | Current season for seasonal content |
| `language_preference` | `string` | `English`, `Hindi`, `Spanish`, etc. | Preferred content language |
| `subtitle_usage` | `float` | `0.0` - `1.0` | Frequency of using subtitles |

### **Temporal Patterns**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `peak_viewing_time` | `int` | `18` - `23` | Hour of day with highest viewing activity |
| `weekend_ratio` | `float` | `0.0` - `1.0` | Weekend vs weekday viewing preference |
| `session_length_avg` | `float` | `20.0` - `120.0` | Average viewing session duration in minutes |
| `time_since_last_watch` | `float` | `0.0` - `168.0` | Hours since last viewing session |
| `daily_consistency` | `float` | `0.0` - `1.0` | Regularity of daily viewing patterns |

### **Social & Trends**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `trend_affinity` | `float` | `0.0` - `1.0` | Age-adjusted interest in trending content |
| `friend_influence` | `float` | `0.0` - `1.0` | Susceptibility to social recommendations |
| `social_engagement` | `float` | `0.0` - `1.0` | Age-based social media activity level |
| `group_watch_freq` | `float` | `0.0` - `1.0` | Co-viewing and shared watching behavior |
| `viral_content_affinity` | `float` | `0.0` - `1.2` | Attraction to viral and trending content |
| `event_interest` | `float` | `0.0` - `1.0` | Interest in event-related content |
| `social_media_activity` | `float` | `0.0` - `1.0` | Overall social media engagement level |
| `trend_responsiveness` | `float` | `0.0` - `1.0` | Speed of response to trending topics |
| `current_event_engagement` | `float` | `0.0` - `1.0` | Engagement with current event content |

### **Environmental Context**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `weather_impact` | `float` | `1.0` - `1.6` | Weather influence on viewing behavior |
| `seasonal_content_pref` | `float` | `0.0` - `1.0` | Preference for seasonally appropriate content |
| `location_content_match` | `float` | `0.0` - `1.0` | Preference for location-relevant content |
| `holiday_boost` | `float` | `0.0` - `1.0` | Holiday-season viewing behavior changes |

### **Composite User Scores**
| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| `engagement_score` | `float` | `0.0` - `1.0` | Overall platform engagement (completion + rating + autoplay + social) |
| `mood_genre_alignment` | `float` | `0.0` - `1.0` | How well current mood matches genre preferences |
| `personalization_score` | `float` | `0.0` - `1.0` | Effectiveness of personalized recommendations |
| `contextual_fit` | `float` | `0.0` - `1.0` | How well current context matches viewing patterns |
| `new_release_responsiveness` | `float` | `0.0` - `1.3` | Likelihood to watch newly released content |
| `documentary_affinity` | `float` | `0.0` - `1.0` | Specific preference for documentary content |
| `morning_view_ratio` | `float` | `0.0` - `1.0` | Tendency to watch content in morning hours |
| `device_engagement` | `float` | `0.0` - `1.0` | Engagement level across different devices |
| `cultural_affinity` | `int` | `0`, `1` | Binary indicator for cultural content preference |

## Dataset Configuration

### **Current Events Simulation**
- `plane_crash`, `elections`, `world_cup`, `tech_breakthrough` - Real-time event relevance scoring
- **Weight System:** 0.7-0.9 for high-impact events, keyword matching for content relevance

### **Geographic Patterns**
- **8 Countries:** USA, UK, Canada, Australia, Germany, Japan, Brazil, India
- **City-Specific Patterns:** Session length, peak hours, documentary affinity
- **Cultural Mapping:** Bollywood/Tollywood tags, regional preferences

### **Trend-Aware Engineering**
- **Social Media Simulation:** Mentions based on ratings × trending score
- **Viral Potential:** Event relevance (70%) + trending score (30%)
- **Search Volume:** Rating count × event relevance for discovery patterns

## Dataset Summary
- **Movies:** 100 films with 40+ engineered features
- **Users:** 50,000 profiles with 50+ behavioral attributes  
- **Purpose:** Advanced recommendation system training and testing
- **Applications:** Context-aware ML, trend prediction, personalization algorithms
