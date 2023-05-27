export const LOGIN = "/login";
export const REGISTER = "/register";
export const MY_LISTINGS = "/my-listings";
export const LISTINGS = "/listings";
export const FIND_BUYER = "/find-buyer";
export const PRICE_FEEDS = "/price-feeds";
export const BENEFITS = "/benefits";
export const FIND_FARMERS = "/find-farmers";

const publicPaths = [LOGIN];

const privatePaths = [...new Set([...publicPaths, REGISTER])];

const farmerPaths = [
  ...new Set([
    ...publicPaths,
    ...privatePaths,
    MY_LISTINGS,
    FIND_BUYER,
    PRICE_FEEDS,
    BENEFITS,
  ]),
];

const buyerPaths = [
  ...new Set([...publicPaths, ...privatePaths, LISTINGS, FIND_FARMERS]),
];

export { publicPaths, privatePaths, farmerPaths, buyerPaths };
