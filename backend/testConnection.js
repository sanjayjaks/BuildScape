const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/buildscape')
  .then(() => {
    console.log('✅ MongoDB connected');

    mongoose.connection.once('open', async () => {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('✅ Collections in DB:', collections.map(c => c.name));
        process.exit(0);
      } catch (err) {
        console.error('❌ Error listing collections:', err);
        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }); 