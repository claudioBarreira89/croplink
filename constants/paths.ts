export const LOGIN = "/login";
export const REGISTER = "/register";
export const MY_LISTINGS = "/my-listings";
export const LISTINGS = "/listings";
export const FIND_BUYER = "/find-buyer";
export const PRICE_FEEDS = "/price-feeds";
export const VERIFY = "/verify";
export const BENEFITS = "/benefits";

const publicPaths = [LOGIN];

const privatePaths = [...new Set([...publicPaths, REGISTER])];

const farmerPaths = [
  ...new Set([
    ...publicPaths,
    ...privatePaths,
    MY_LISTINGS,
    FIND_BUYER,
    PRICE_FEEDS,
    VERIFY,
    BENEFITS,
  ]),
];

const buyerPaths = [...new Set([...publicPaths, ...privatePaths, LISTINGS])];

export { publicPaths, privatePaths, farmerPaths, buyerPaths };
