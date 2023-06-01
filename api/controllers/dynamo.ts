const AWS = require("aws-sdk");
const dotenvDynamo = require("dotenv");

dotenvDynamo.config();

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

const getFarmers = async () => {
  const params = {
    TableName: USERS_TABLE_NAME,
    FilterExpression: "farmer = :val",
    ExpressionAttributeValues: {
      ":val": true,
    },
  };
  return await dynamoClient.scan(params).promise();
};

const getBuyers = async () => {
  const params = {
    TableName: USERS_TABLE_NAME,
    FilterExpression: "buyer = :val",
    ExpressionAttributeValues: {
      ":val": true,
    },
  };
  return await dynamoClient.scan(params).promise();
};

const updateUser = async (user: object) => {
  const params = {
    TableName: USERS_TABLE_NAME,
    Item: user,
  };
  return await dynamoClient.put(params).promise();
};

const createUser = async (userId: string) => {
  const newUser = {
    id: userId,
    farmer: false,
    buyer: false,
    isRegistered: false,
    isVerified: false,
    governmentId: "",
    treasuryBalance: 0,
    claimTimestamp: 0,
  };
  const params = {
    TableName: USERS_TABLE_NAME,
    Item: newUser,
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
    await updateUser(user.Item);
  }
};

const setIsVerified = async (id: string, isVerified: boolean) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.isVerified = isVerified;
    await updateUser(user.Item);
  }
};

const setGovernmentId = async (id: string, governmentId: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.governmentId = governmentId;
    await updateUser(user.Item);
  }
};

const setTreasuryBalance = async (id: string, treasuryBalance: number) => {
  const user = await getUserById(id);
  if (!user.Item) {
    throw new Error("User not found"); // Throw an error if the user does not exist
  }
  if (user.Item) {
    user.Item.treasuryBalance = treasuryBalance;
    await updateUser(user.Item);
  }
};

const setClaimTimestamp = async (id: string, claimTimestamp: number) => {
  const user = await getUserById(id);
  if (user.Item) {
    user.Item.claimTimestamp = claimTimestamp;
    await updateUser(user.Item);
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

const isFarmer = async (id: string) => {
  const user = await getUserById(id);
  if (user.Item) {
    return user.Item.farmer;
  }
};

const isBuyer = async (id: string) => {
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
      await updateUser(user.Item);
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
      await updateUser(user.Item);
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

const db = {
  getUsers,
  updateUser,
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
  createUser,
  getBuyers,
  getFarmers,
};

module.exports = db;
