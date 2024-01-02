import mongoose from "mongoose";
require("dotenv").config();

const dbState = [
  { value: 0, label: "disconnected" },
  { value: 1, label: "connected" },
  { value: 2, label: "connecting" },
  { value: 3, label: "disconnecting" },
];

const dbHost = process.env.DB_HOST as string;

const getConnection = async () => {
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    family: 4,
  };
  const connection = await mongoose.connect(dbHost, options);
  const state = Number(mongoose.connection.readyState);
  console.log(dbState.find((f) => f.value === state)?.label, "to db"); // connected to db
  return connection;
};

export default getConnection;
