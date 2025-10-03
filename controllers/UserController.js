const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* require("dotenv").config(); */
exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 8),
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    user.email = email || user.email;
    user.password = password || user.password;
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    await user.destroy();
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error en el login",error });
  }
};
