const express = require('express');

const {
  getAll,
  getById,
  add,
  updateById,
  removeById,
  updateStatusContact,
} = require('../../controllers/contacts');

const { contactJoiSchema, favoriteJoiSchema } = require('../../schemas');

const { validation, ctrlWrapper, auth } = require('../../middelwares');

const router = express.Router();

router.use(auth);
router.route('/').get(ctrlWrapper(getAll)).post(validation(contactJoiSchema), ctrlWrapper(add));

router
  .route('/:contactId')
  .get(ctrlWrapper(getById))
  .delete(ctrlWrapper(removeById))
  .put(validation(contactJoiSchema), ctrlWrapper(updateById));

router
  .route('/:contactId/favorite')
  .patch(validation(favoriteJoiSchema), ctrlWrapper(updateStatusContact));

module.exports = router;
