const knex = require('../database/connection');

class Category {

    async findAll() {
        try {
            var result = await knex.select().table('category');
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select().where({ id }).table('category');

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
            var result = await knex.select().where({ name }).table('category');

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

    async getNames() {
        try {
            var result = await knex.select(['id', 'name', 'amount']).table('category');
            return result;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async new(name, description) {
        try {
            await knex.insert({ name, description, amount: 0 }).table('category');
            return { status: true }
        } catch (err) {
            console.log(err);
            return { status: false, err: 'Não foi possível criar a categoria' }
        }
    }

    async findName (name) {
        try {
            var result = await knex.select().from('category').where({name: name});
            
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
        var category = await this.findById(id);

        // Varifica se a categoria com esse ID existe
        if(category != undefined) {
            var editCategory = {};

            // Verifica se o nome da categoria já está cadastrado
            if (name != undefined) {
                if (name != category.name) {
                    var result = await this.findByName(name);

                    if (!result) {
                        editCategory.name = name;
                    } else {
                        return {status: false, err: 'Já existe uma categoria com esse nome'}
                    }
                }
            }

            // Atualiza a descrição
            if (description != undefined)
                editCategory.description = description;

            // Faz o update
            try {
                await knex.update(editCategory).where({ id: id }).table('category');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível atualizar a categoria' };
            }

        } else {
            return { status: false, err: 'Categoria não existe, portanto não foi atualizada' }
        }
    }

    async delete(id) {
        
        var category = await this.findById(id);

        if(category != undefined) {

            try {
                await knex.delete().where({ id: id }).table('category');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: 'Não foi possível deletar a categoria' };
            }
        } else {
            return { status: false, err: 'Categoria não existe, portanto não foi deletada' };
        }
    }

    async updateAmount(id, number) {
        var category = await this.findById(id);

        if (category != undefined) {
            category.amount = category.amount + number;
            
            try {
                await knex.update({ amount: category.amount }).where({ id: id }).table('category');
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

module.exports = new Category();