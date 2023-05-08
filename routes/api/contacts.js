const express = require('express')

const router = express.Router();

const ctrl = require("../../controllers/contacts");

const { validateBody,isValidId,authenticate } = require("../../middlewars");

const {schema} = require("../../models/contact")


router.get('/',authenticate, ctrl.getAll);

router.get('/:contactId',authenticate,isValidId, ctrl.getById)

router.post('/',authenticate, validateBody(schema.addSchema), ctrl.add)

router.delete('/:contactId',authenticate,isValidId,ctrl.deleteById);

router.put('/:contactId',authenticate,isValidId, validateBody(schema.updateSchema), ctrl.updateById);

router.patch('/:contactId/favorite',authenticate,isValidId, validateBody(schema.updateFavoriteSchema), ctrl.updateFavorite)



module.exports = router
