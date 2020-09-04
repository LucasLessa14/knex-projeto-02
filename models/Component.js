const knex = require('../database/connection');

class Component {

    async findAll() {
        try {
            var result = await knex.select().table('component');
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select().where({ id }).table('component');

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
            var result = await knex.select().where({ name }).table('component');

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

    async new(name, amount, category_id, compartment_id) {
        try {
            await knex.insert({ name, category_id, compartment_id, amount }).table('component');
            return { status: true }
        } catch (err) {
            console.log(err);
            return { status: false, err: 'Não foi possível criar o componente' }
        }
    }

    async findName (name) {
        try {
            var result = await knex.select().from('component').where({name: name});
            
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

    async update (id, name, amount, category_id, compartment_id) {
        var component = await this.findById(id);

        // Varifica se a categoria com esse ID existe
        if(component != undefined) {
            var editComponent = {};

            // Verifica se o nome da categoria já está cadastrado
            if (name != undefined) {
                if (name != component.name) {
                    var result = await this.findByName(name);

                    if (!result) {
                        editComponent.name = name;
                    } else {
                        return {status: false, err: 'Já existe um componente com esse nome'}
                    }
                }
            }

            // Atualiza a descrição
            if (amount != undefined)
                editComponent.amount = amount;

            // Atualiza a descrição
            if (category_id != undefined)
                editComponent.category_id = category_id;

            // Atualiza a descrição
            if (compartment_id != undefined)
                editComponent.compartment_id = compartment_id;

            // Faz o update
            try {
                await knex.update(editComponent).where({ id: id }).table('component');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível atualizar o componente' };
            }

        } else {
            return { status: false, err: 'Componente não existe, portanto não foi atualizado' }
        }
    }

    async delete(id) {
        
        var component = await this.findById(id);

        if (component != undefined) {

            try {
                await knex.delete().where({ id: id }).table('component');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível deletar o componente' };
            }
        } else {
            return { status: false, err: 'Componente não existe, portanto não foi deletada' };
        }
    }
}

module.exports = new Component();