import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  try {
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    throw error;
  }
};

export const generateToken1 = async (email) => {
  try {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    throw error;
  }
};

// ---------------------------------------------------------------
// Cookie options shared by every login / logout.
// Production (Render, HTTPS): secure + sameSite "none" so the cookie
// also works when the frontend and backend are on different domains.
// Local development (http://localhost): secure false + sameSite "lax".
// ---------------------------------------------------------------
const isProd = () => process.env.NODE_ENV === "production";

export const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProd(),
  sameSite: isProd() ? "none" : "lax",
  maxAge,
});

// clearCookie only works if these match the options used to set it
export const clearCookieOptions = () => ({
  httpOnly: true,
  secure: isProd(),
  sameSite: isProd() ? "none" : "lax",
});
