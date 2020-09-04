const knex = require('../database/connection');

class Compartment {

    async findAll() {
        try {
            var result = await knex.select().table('compartment');
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select().where({ id }).table('compartment');

            // Garante que a função retorna um único valor
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async findByName(name) {
        try {
            var result = await knex.select().where({ name }).table('compartment');

            // Garante que a função retorna um único valor
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined
            }
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async new(name, description) {
        try {
            await knex.insert({ name, description, amount: 0 }).table('compartment');
            return { status: true }
        } catch (err) {
            console.log(err);
            return { status: false, err: 'Não foi possível criar a compartimento' }
        }
    }

    async findName (name) {
        try {
            var result = await knex.select().from('compartment').where({name: name});
            
            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async update (id, name, description) {
        var compartment = await this.findById(id);

        // Varifica se a compartimento com esse ID existe
        if(compartment != undefined) {
            var editCompartment = {};

            // Verifica se o nome da compartimento já está cadastrado
            if (name != undefined) {
                if (name != Compartment.name) {
                    var result = await this.findByName(name);

                    if (!result) {
                        editCompartment.name = name;
                    } else {
                        return {status: false, err: 'Já existe uma compartimento com esse nome'}
                    }
                }
            }

            // Atualiza a descrição
            if (description != undefined)
                editCompartment.description = description;

            // Faz o update
            try {
                await knex.update(editCompartment).where({ id: id }).table('compartment');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível atualizar a compartimento' };
            }

        } else {
            return { status: false, err: 'Compartimento não existe, portanto não foi atualizada' }
        }
    }

    async delete(id) {
        
        var compartment = await this.findById(id);

        if(compartment != undefined) {

            try {
                await knex.delete().where({ id: id }).table('compartment');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível deletar a compartimento' };
            }
        } else {
            return { status: false, err: 'Compartimento não existe, portanto não foi deletada' };
        }
    }

    async updateAmount(id, number) {
        var compartment = await this.findById(id);

        if (compartment != undefined) {
            compartment.amount = compartment.amount + number;
            
            try {
                await knex.update({ amount: compartment.amount }).where({ id: id }).table('compartment');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Erro ao atualizar a amount em categoria' };
            }            
        } else {
            return { status: false, err: 'Categoria não existe' };
        }
    }
}

module.exports = new Compartment();