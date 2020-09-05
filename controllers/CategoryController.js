const Category = require('../models/Category');

class CategoryController {

    async index(req, res) {
        var categories = await Category.findAll();
        res.json(categories);
    }

    async list(req, res) {
        var categories = await Category.getNames();
        res.json(categories);
    }

    async findCategory(req, res) {
        var id = req.params.id;
        var category = await Category.findById(id);
        
        if (category == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(category);
        }
    }

    async create(req, res) {

        var { name, description } = req.body;

        if (name == undefined || name == '' || name == ' ') {
            res.status(400);
            res.json({err: 'Nome de categoria inválido'});
            return;
        }

        var nameExists = await Category.findName(name);
        
        if (nameExists) {
            res.status(406);
            res.json({err: 'Já existe uma categoria com esse nome'});
            return;
        } else {
            try {
                var result = await Category.new(name, description);
                res.json(result);
                return;
            } catch (err) {
                res.status(406);
                res.json({err: 'Não foi possível criar a categoria'});
                return;
            }
        }
    }

    async edit(req, res) {
        var { id, name, description } = req.body;
        var result = await Category.update(id, name, description);

        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send(result);
            } else {
                res.status(406);
                res.json(result.err);
            }
        } else {
            res.status(406);
            res.json('Ocorreu um erro no servidor');
        }
    }

    async remove(req,res) {
        var id = req.params.id;

        var result = await Category.delete(id);

        if (result.status) {
            res.status(200);
            res.send(result);
        } else {
            res.status(406);
            res.json(result.err);
        }
    }

}

module.exports = new CategoryController();