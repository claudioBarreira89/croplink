const ironOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PW,
  cookieOptions: {
    secure: false,
  },
};

export default ironOptions;
