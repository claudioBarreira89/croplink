import AWS from "aws-sdk";
import { bool } from "aws-sdk/clients/signer";
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
  return await dynamoClient.scan(params).promise();
};

const addOrUpdateUser = async (user: object) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };
  return await dynamoClient.put(params).promise();
};

const getUserById = async (id: String) => {
  //id is the blockchain address
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

//working with properties
const setIsRegistered = async (id: string, isRegistered: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.isRegistered = isRegistered;
    console.log(user.Item.isRegistered);
    await addOrUpdateUser(user.Item);
  }
};

const setIsVerified = async (id: string, isVerified: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.isVerified = isVerified;
    await addOrUpdateUser(user.Item);
  }
};

const setGovernmentId = async (id: string, governmentId: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.governmentId = governmentId;
    await addOrUpdateUser(user.Item);
  }
};

const setTreasuryBalance = async (id: string, treasuryBalance: number) => {
  const user = await getUserById(id);
  if (!user.Item) {
    throw new Error("User not found"); // Throw an error if the user does not exist
  }
  if (user.Item) {
    user.Item.treasuryBalance = treasuryBalance;
    await addOrUpdateUser(user.Item);
  }
};

const setClaimTimestamp = async (id: string, claimTimestamp: number) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.claimTimestamp = claimTimestamp;
    await addOrUpdateUser(user.Item);
  }
};

const getIsRegistered = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.isRegistered;
  }
};

const getIsVerified = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.isVerified;
  }
};

const getGovernmentId = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.governmentId;
  }
};

const getTreasuryBalance = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.treasuryBalance;
  }
};

const getClaimTimestamp = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.claimTimestamp;
  }
};

const isFarmer = async (id: string, farmer: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.farmer;
  }
};

const isBuyer = async (id: string, farmer: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.buyer;
  }
};

const setIsFarmer = async (id: string, farmer: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    if (user.Item.buyer && farmer) {
      throw new Error("User is already a buyer. User cannot be both!");
    } else {
      user.Item.farmer = farmer;
      await addOrUpdateUser(user.Item);
    }
  }
};
const setIsBuyer = async (id: string, buyer: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    if (user.Item.farmer && buyer) {
      throw new Error("User is already a farmer. User cannot be both!");
    } else {
      user.Item.buyer = buyer;
      await addOrUpdateUser(user.Item);
    }
  }
};
// const user = {
//   id: "FNDJKFNKSN",
//   farmer: false,
//   buyer: false,
//   isRegistered: false,
//   isVerified: false,
//   governmentId: "",
//   treasuryBalance: 0,
//   claimTimestamp: 12903013,
// };

module.exports = {
  getUsers,
  addOrUpdateUser,
  getUserById,
  deleteUser,
  setIsRegistered,
  setIsVerified,
  setGovernmentId,
  setTreasuryBalance,
  setClaimTimestamp,
  getIsRegistered,
  getIsVerified,
  getGovernmentId,
  getTreasuryBalance,
  getClaimTimestamp,
  isFarmer,
  isBuyer,
  setIsFarmer,
  setIsBuyer,
};
