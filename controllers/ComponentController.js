const Category = require('../models/Category');
const Component = require('../models/Component');
const Compartment = require('../models/Compartment');

class ComponentController {

    async index(req, res) {
        var components = await Component.findAll();
        res.json(components);
    }

    async findComponent(req, res) {
        var id = req.params.id;
        var component = await Component.findById(id);
        
        if (component == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(component);
        }
    }

    async create(req, res) {

        var { name, amount, category_id, compartment_id } = req.body;

        if (name == undefined || name == '' || name == ' ') {
            res.status(400);
            res.json({err: 'Nome de componente inválido'});
            return;
        }

        if (amount == undefined || amount == '' || amount == ' ') {
            res.status(400);
            res.json({err: 'Quantidade de componente inválida'});
            return;
        }

        var categoryExists = await Category.findById(category_id);

        if (categoryExists == undefined) {
            res.status(400);
            res.json({err: 'Categoria de componente inválida'});
            return;
        }

        var compartmentExists = await Compartment.findById(compartment_id);

        if (compartmentExists == undefined) {
            res.status(400);
            res.json({err: 'Compartimento de componente inválida'});
            return;
        }

        var nameExists = await Component.findName(name);
        
        if (nameExists) {
            res.status(406);
            res.json({err: 'Já existe um componente com esse nome'});
            return;
        } else {
            try {
                var result = await Component.new(name, amount, category_id, compartment_id);
                await Compartment.updateAmount(compartment_id, amount);
                await Category.updateAmount(category_id, amount);
                res.json(result);
                return;
            } catch (err) {
                res.status(406);
                res.json({err: 'Não foi possível criar o componente'});
                return;
            }
        }
    }

    async edit(req, res) {
        var { id, name, amount, category_id, compartment_id } = req.body;

        if (category_id != undefined) {

            var categoryExists = await Category.findById(category_id);
    
            if (categoryExists == undefined) {
                res.status(400);
                res.json({err: 'Categoria de componente inválida'});
                return;
            }
        }

        if (compartment_id != undefined) {

            var compartmentExists = await Compartment.findById(compartment_id);
    
            if (compartmentExists == undefined) {
                res.status(400);
                res.json({err: 'Compartimento de componente inválido'});
                return;
            }
        }

        var result = await Component.update(id, name, amount, category_id, compartment_id);

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

        var component = await Component.findById(id);

        if (component != undefined) {
            
            try {
                var result = await Component.delete(id);
    
                if (result.status) {
                    await Compartment.updateAmount(component.compartment_id, -1 * amount);
                    await Category.updateAmount(component.category_id, -1 * amount);
                    res.status(200).send(result);
                    return;
                } else {
                    res.status(406).json(result.err);
                    return;
                }
    
            } catch (err) {
                console.log(err);
                res.status(406).json({err: 'Não foi possível deletar o componente'});
                return;
            }
        } else {
            res.status(406).json({err: 'Componente não existe'});
            return;
        }
    }
}

module.exports = new ComponentController();