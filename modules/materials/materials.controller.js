
class MaterialsController {
  constructor() {}

  async uploadMaterial(req, res) {
    try {
      res.status(200).json({
        filePath: req.body.image
      })
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = {
  MaterialsController: new MaterialsController()
}
