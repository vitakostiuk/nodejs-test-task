const { User } = require("../../models/user");

const logout = async (req, res) => {
  const { _id } = req.user;

  const { all } = req.query;

  if (!all) {
    await User.findByIdAndUpdate(_id, { token: "" });
  }

  if (all) {
    await User.updateMany({ token: "" });
  }

  res.status(204).send();
};

module.exports = logout;
