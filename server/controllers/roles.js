const Roles = require('../models/Roles')

module.exports.createRole = async (req, res) => {
  try {
    const roleToCreate = req

    const existingRole = await Roles.findByPk(roleToCreate.title)
    if (existingRole) throw new Error('Role aldready exists with this title')

    const role = await Roles.create(roleToCreate)

    if (role) {
      res.status(201).json({role})
    }
  } catch (e) {
    res
      .status(422)
      .json({errors: {body: ['Could not create role ', e.message]}})
  }
}
