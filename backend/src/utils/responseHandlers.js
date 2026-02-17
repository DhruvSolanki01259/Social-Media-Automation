export const errorHandler = (res, code, message) => {
  const statusCode = code || 400;
  try {
    res
      .status(statusCode)
      .json({ success: false, error: true, statusCode, message });
    return;
  } catch (error) {
    console.log("Error in Error Handler:", error.message);
    return;
  }
};

export const successHandler = (res, code, message, user, token) => {
  try {
    const statusCode = code || 200;
    const msg = message || "Successfull";
    const { password, ...safeUser } = user._doc;
    res.status(statusCode).json({
      success: true,
      error: false,
      message: msg,
      user: safeUser,
      token,
    });
    return;
  } catch (error) {
    console.log("Error in Success Handler:", error.message);
    return;
  }
};

export const serverErrorHandler = (res, code, errorMessage) => {
  const msg = errorMessage || "Internal Server Error";
  const statusCode = code || 500;
  try {
    res
      .status(statusCode)
      .json({ success: false, error: true, statusCode, message: msg });
    return;
  } catch (error) {
    console.log("Error in Server Error Handler:", error.message);
    return;
  }
};
