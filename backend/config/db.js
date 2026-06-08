const mongoose = require('mongoose');

// Prefer environment-configured URIs, otherwise use the provided Atlas link
const ATLAS_URI = process.env.MONGO_ATLAS_URI || 'mongodb+srv://bharathkumar:eyecontact123@bharath007.l9hvroe.mongodb.net/?appName=bharath007';
const LOCAL_URI = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/petstore';

const connectDB = async () => {
  const uris = [
    ATLAS_URI,
    process.env.MONGO_URI,
    LOCAL_URI,
  ].filter(Boolean);

  const options = {
    // new MongoDB driver uses these by default; keep fast server selection for quick fallback
    serverSelectionTimeoutMS: 5000,
  };

  for (const uri of uris) {
    try {
      const conn = await mongoose.connect(uri, options);
      const src = /mongodb\+srv:/.test(uri) ? 'Atlas' : /127\.0\.0\.1|localhost/.test(uri) ? 'Local' : 'MongoDB';
      console.log(`MongoDB connected (${src}): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection failed for URI: ${uri}`);
      console.error(error.message);
    }
  }

  console.error('All MongoDB connection attempts failed.');
  process.exit(1);
};

module.exports = connectDB;
