const User = require("../models/User");
const jwt = require("jsonwebtoken");
/* require("dotenv").config(); */
exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error " });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
     return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid =
      password ===
      user.password; /* bcrypt.compareSync(password, user.password) */
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email},
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error en el login" });
  }
};
