//linkTokenAddress = "0x514910771af9ca656af840dff83e8264ecf986ca"
//oracleAddress = "0xFeAB6A3D21aA72e0AFD0F322baCf2d3C9ee11A3c";

//const { ethers } = require("hardhat");
//async function main() {
//  const [deployer] = await ethers.getSigners();
//  const networkName = network.name;
//
//  let linkTokenAddress;
//  let oracleAddress;
//
//  // Set the appropriate Link Token address and Oracle address based on the network
//  if (networkName === "mumbai") {
//    linkTokenAddress = "0x514910771af9ca656af840dff83e8264ecf986ca";
//    oracleAddress = "0xFeAB6A3D21aA72e0AFD0F322baCf2d3C9ee11A3c";
//  } else {
//    console.log(`Unsupported network: ${networkName}`);
//    return;
//  }
//
//  // Deploy the CropLink contract
//  const CropLink = await ethers.getContractFactory("CropLink");
//  const cropLink = await CropLink.deploy(linkTokenAddress, oracleAddress);
//
//  console.log("CropLink contract deployed to:", cropLink.address);
//}
//
//// Run the deployment
//main()
//  .then(() => process.exit(0))
//  .catch((error) => {
//    console.error(error);
//    process.exit(1);
//  });
//

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = "mumbai"; // Specify the network name directly

  let linkTokenAddress;
  let oracleAddress;

  // Set the appropriate Link Token address and Oracle address based on the network
  if (networkName === "mumbai") {
    linkTokenAddress = "0x514910771af9ca656af840dff83e8264ecf986ca";
    oracleAddress = "0xFeAB6A3D21aA72e0AFD0F322baCf2d3C9ee11A3c";
  } else {
    console.log(`Unsupported network: ${networkName}`);
    return;
  }

  // Deploy the CropLink contract
  const CropLink = await ethers.getContractFactory("CropLink");
  const cropLink = await CropLink.deploy(linkTokenAddress, oracleAddress);

  console.log("CropLink contract deployed to:", cropLink.address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
