const { MongoClient } = require("mongodb");

const Db = process.env.MONGO_URI;

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  async connectToServer() {
    try {
      await client.connect();
      _db = client.db("fast_burger");
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  },

  getDb() {
    if (!_db) {
      console.error("Database not connected.");
    }
    return _db;
  },
};
