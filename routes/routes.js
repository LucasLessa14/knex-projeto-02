const router = require("express").Router();
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const ComponentController = require("../controllers/ComponentController");
const CompartmentController = require("../controllers/CompartmentController");
const AdminAuth = require('../middleware/AdminAuth');

router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

router.post('/user', UserController.create);
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.put('/user', AdminAuth, UserController.edit);
router.delete('/user/:id', AdminAuth, UserController.remove);

router.get('/category/names', CategoryController.list);
router.get('/category', CategoryController.index);
router.post('/category', CategoryController.create);
router.get('/category/:id', CategoryController.findCategory);
router.delete('/category/:id', CategoryController.remove);
router.put('/category', CategoryController.edit);

router.get('/compartment', CompartmentController.index);
router.post('/compartment', CompartmentController.create);
router.get('/compartment/:id', CompartmentController.findCompartment);
router.delete('/compartment/:id', CompartmentController.remove);
router.put('/compartment', CompartmentController.edit);

router.get('/component', ComponentController.index);
router.post('/component', ComponentController.create);
router.get('/component/:id', ComponentController.findComponent);
router.delete('/component/:id', ComponentController.remove);
router.put('/component', ComponentController.edit);

router.post('/validate', AdminAuth, UserController.validate);

module.exports = router;