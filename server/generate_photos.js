// Script to generate photos with Picsum URLs
const fs = require('fs');

// Read the current db.json
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Generate photos for each album (10-15 photos per album)
const photos = [];
let photoId = 1;

for (let albumId = 1; albumId <= 20; albumId++) {
  const photosPerAlbum = Math.floor(Math.random() * 6) + 10; // 10-15 photos
  
  for (let i = 0; i < photosPerAlbum; i++) {
    photos.push({
      albumId: albumId,
      id: photoId.toString(),
      title: `Photo ${photoId} from album ${albumId}`,
      url: `https://picsum.photos/600/400?random=${photoId}`,
      thumbnailUrl: `https://picsum.photos/150/150?random=${photoId}`
    });
    photoId++;
  }
}

// Update the database
db.photos = photos;

// Write back to db.json
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log(`Generated ${photos.length} photos for 20 albums`);