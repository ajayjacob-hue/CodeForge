const mongoose = require('mongoose');

// Standard connection string (bypassing SRV)
const uri = "mongodb://admin:cWkU17NB8wafgAE7@ac-ju85dqe-shard-00-00.ka9iu4q.mongodb.net:27017,ac-ju85dqe-shard-00-01.ka9iu4q.mongodb.net:27017,ac-ju85dqe-shard-00-02.ka9iu4q.mongodb.net:27017/Codeforge?ssl=true&replicaSet=atlas-ju85dqe-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting using standard string...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

run();
