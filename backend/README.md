# 🎬 Google Trends API Backend

A robust Node.js/TypeScript backend service that scrapes Google Trends data specifically for entertainment content (movies and TV shows).

## 🚀 Features

- **Real-time Google Trends data** for movies and TV shows
- **Smart caching** to reduce API calls and improve performance
- **Multiple data sources**: Daily trends, real-time trends, related queries
- **Entertainment filtering** - only returns movie and TV show content
- **Regional support** - get trends for different countries
- **Rate limiting** and error handling
- **TypeScript** for type safety
- **RESTful API** endpoints

## 📦 Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## 🏃‍♂️ Running the Server

### Development Mode
```bash
npm run dev
```
The server will run on `http://localhost:5000` with auto-reload.

### Production Mode
```bash
npm start
```

## 🔌 API Endpoints

### Entertainment Trends
```http
GET /api/trends/entertainment?geo=US
```
Returns filtered entertainment trends (movies & TV shows only).

### Daily Trends
```http
GET /api/trends/daily?geo=US
```
Returns today's trending searches.

### Real-time Trends
```http
GET /api/trends/realtime?geo=US&category=e
```
Returns real-time trending stories.

### Interest Over Time
```http
GET /api/trends/interest/:keyword?geo=US
```
Returns search interest data for a specific keyword.

### Related Queries
```http
POST /api/trends/related
Content-Type: application/json

{
  "keywords": ["netflix shows", "movies 2024"],
  "geo": "US"
}
```

### Health Check
```http
GET /api/trends/health
```
Returns service health status.

## 🌍 Supported Regions

- `US` - United States
- `GB` - United Kingdom  
- `CA` - Canada
- `AU` - Australia
- `IN` - India
- And more...

## ⚡ Performance Features

- **Intelligent Caching**: Reduces API calls by caching results
- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Graceful fallbacks when APIs fail
- **Request Deduplication**: Prevents duplicate trending items

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `CACHE_TTL` | Cache TTL in seconds | `1800` (30 min) |

### Cache Settings

- **Real-time trends**: 10 minutes
- **Daily trends**: 1 hour  
- **Entertainment trends**: 30 minutes
- **Related queries**: 1 hour

## 🚨 Error Handling

The API includes comprehensive error handling:

- **Service unavailable**: Returns mock data as fallback
- **Rate limiting**: Returns 429 with retry information
- **Invalid requests**: Returns 400 with error details
- **Server errors**: Returns 500 with error message

## 📊 Data Processing

The service automatically:

1. **Filters content** for entertainment only
2. **Deduplicates** trending items
3. **Calculates trending scores** based on multiple factors
4. **Extracts search volumes** from formatted traffic data
5. **Determines content type** (movie vs TV show)

## 🔧 Development

### Project Structure 