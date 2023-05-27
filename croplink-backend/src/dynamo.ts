import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE_NAME = "croplink-users";

const getUsers = async () => {
  const params = {
    TableName: USERS_TABLE_NAME,
  };
  const users = await dynamoClient.scan(params).promise();
  console.log(users);
  return users;
};

const addOrUpdateUser = async (user: any) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };
  return await dynamoClient.put(params).promise();
};

const getUserById = async (id: String) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.get(params).promise();
};

const deleteUser = async (id: String) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Key: { id },
  };
  return await dynamoClient.delete(params).promise();
};

const d = { id: "324289482394", name: "jamie", role: "farmer" };
const a = { id: "fd" };
getUserById("324289482394");
getUsers();
