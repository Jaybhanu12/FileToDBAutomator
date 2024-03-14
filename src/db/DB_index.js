import mongoose from "mongoose";
const connectDBAndPushData = async (CollectionName, data) => {
  const MoongoDB = await mongoose.connect(process.env.DB_CONNECT, {
    dbName: "Automation",
  });
  try {
    // await MoongoDB.connect();
    const db = MoongoDB.connection;
    if (!db) {
      throw new Error("Failed to connect to MongoDB!!");
    }
    const collection = db.collection(CollectionName);
    await collection.insertMany(data);
    console.log(`Data pushed successfully into collection ${CollectionName}`);
    
  } catch (error) {
    console.error(
      `Error while inserting data into collection ${CollectionName}: ${error}`
    );
  } finally {
    await mongoose.connection.close();
  }
};

export default connectDBAndPushData;
