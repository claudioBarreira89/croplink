const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PW as string,
  cookieOptions: {
    secure: false,
  },
};

export default ironOptions;
