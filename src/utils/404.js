export default (model, id, res) => {
  return res
    .status(404)
    .send({
      success: false,
      message: `Sorry! The ${model} with id -> ${id} could not be found!`,
    })
}
