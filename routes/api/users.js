const express = require('express');
const { validation, ctrlWrapper, auth } = require('../../middelwares');
const {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
} = require('../../controllers/users');
const { userRegisterJoiSchema, userLoginJoiSchema } = require('../../schemas');

const router = express.Router();

router.route('/').patch(auth, ctrlWrapper(updateSubscription));
router.route('/register').post(validation(userRegisterJoiSchema), ctrlWrapper(register));
router.route('/login').post(validation(userLoginJoiSchema), ctrlWrapper(login));
router.route('/logout').get(auth, ctrlWrapper(logout));
router.route('/current').get(auth, ctrlWrapper(getCurrent));

module.exports = router;
