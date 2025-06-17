{
  "scripts": {
    "start:dev": "concurrently \"npm run dev\" \"cd ../.. && npm run dev\"",
    "install:all": "npm install && cd ../.. && npm install",
    "build:all": "npm run build && cd ../.. && npm run build"
  }
} 