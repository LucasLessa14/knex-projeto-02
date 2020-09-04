const Compartment = require('../models/Compartment');

class CompartmentController {

    async index(req, res) {
        var compartments = await Compartment.findAll();
        res.json(compartments);
    }

    async findCompartment(req, res) {
        var id = req.params.id;
        var compartment = await Compartment.findById(id);
        
        if (compartment == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(compartment);
        }
    }

    async create(req, res) {

        var { name, description } = req.body;

        if (name == undefined || name == '' || name == ' ') {
            res.status(400);
            res.json({err: 'Nome de compartimento inválido'});
            return;
        }

        var nameExists = await Compartment.findName(name);
        
        if (nameExists) {
            res.status(406);
            res.json({err: 'Já existe um compartimento com esse nome'});
            return;
        } else {
            try {
                var result = await Compartment.new(name, description);
                res.json(result);
                return;
            } catch (err) {
                res.status(406);
                res.json({err: 'Não foi possível criar o compartimento'});
                return;
            }
        }
    }

    async edit(req, res) {
        var { id, name, description } = req.body;
        var result = await Compartment.update(id, name, description);

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

        var result = await Compartment.delete(id);

        if (result.status) {
            res.status(200);
            res.send(result);
        } else {
            res.status(406);
            res.json(result.err);
        }
    }

}

module.exports = new CompartmentController();