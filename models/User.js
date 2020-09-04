const knex = require('../database/connection');
const PasswordToken = require('./PasswordToken');
const bcrypt = require('bcrypt');

class User {

    async findAll() {
        try {
            var result = await knex.select(['id', 'email', 'role', 'name']).table('users');
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) {
        try {
            var result = await knex.select(['id', 'email', 'role', 'name'])
                .where({ id }).table('users');

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

    async findByEmail(email) {
        try {
            var result = await knex.select(['id', 'email', 'password', 'role', 'name'])
                .where({ email }).table('users');

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

    async new (email, password, name) {

        try {
            var hash = await bcrypt.hash(password,9);

            await knex.insert({ email, password: hash, name, role: 0 }).table('users');
        } catch (err) {
            console.log(err);
        }
    }

    async findEmail (email) {
        try {
            var result = await knex.select().from('users').where({email: email});
            
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

    async update (id, email, name, role) {

        var user = await this.findById(id);

        if(user != undefined) {

            var editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    var result = await this.findEmail(email);

                    if (!result) {
                        editUser.email = email;
                    } else {
                        return {status: false, err: 'O email já está cadastrado'}
                    }
                }
            }

            if (name != undefined)
                editUser.name = name;

            if (role != undefined)
                editUser.role = role;

            try {
                await knex.update(editUser).where({ id: id }).table('users');
                return {status: true};
            } catch (err) {
                console.log(err);
                return false;
            }

        } else {
            return { status: false, err: 'Usuário não existe' }
        }
    }

    async delete(id) {
        
        var user = await this.findById(id);

        if(user != undefined) {

            try {
                await knex.delete().where({ id: id }).table('users');
                return { status: true };
            } catch (err) {
                console.log(err);
                return { status: false, err: err };
            }
        } else {
            return { status: false, err: 'Usuário não existe, portanto não foi deletado' };
        }
    }

    async changePassword(newPassword, id, token) {

        var hash = await bcrypt.hash(newPassword, 9);
        await knex.update({ password: hash }).where({ id: id }).table('users');
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();