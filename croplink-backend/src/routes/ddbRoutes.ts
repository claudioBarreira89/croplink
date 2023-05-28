const express = require("express");
const router = express.Router();
import {
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
} from "../dynamo";

// router.route("/signup").post(signUpUser);
// router.route("/signin").post(signInUser);
// router.route("/google-signup").post(googleSignUpUser);
// router.route("/google-signin").post(googleSignInUser);
module.exports = router;
