const { User } = require("../../models/user");

const logout = async (req, res) => {
  const { _id } = req.user;

  const { all } = req.query;

  if (all === "false") {
    await User.findByIdAndUpdate(_id, { token: "" });
  }

  if (all === "true") {
    await User.updateMany({ token: "" });
  }

  res.status(204).send();
};

module.exports = logout;
