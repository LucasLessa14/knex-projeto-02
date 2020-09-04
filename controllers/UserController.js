const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'ldfasakdmclakmclksmcakmks'

class UserController {

    async validate(req, res) {
        res.send('ok!');
    }

    async index(req, res) {
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        var id = req.params.id;
        var user = await User.findById(id);
        
        if (user == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res) {

        var { email, name, password } = req.body;

        if (email == undefined || email == '' || email == ' ') {
            res.status(400);
            res.json({err: 'email inválido'});
            return;
        }

        var emailExists = await User.findEmail(email);
        
        if (emailExists) {
            res.status(406);
            res.json({err: 'O email já cadastrado'});
            return;
        }

        await User.new(email, password, name);

        console.log(req.body);
        res.send("Pegando o body");
    }

    async edit(req, res) {
        var { id, email, name, role } = req.body;
        var result = await User.update(id, email, name, role);

        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send('Tudo OK!');
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

        var result = await User.delete(id);

        if (result.status) {
            res.status(200);
            res.send('Tudo OK!');
        } else {
            res.status(406);
            res.json(result.err);
        }
    }

    async recoverPassword(req,res) {
        var email = req.body.email;

        var result = await PasswordToken.create(email);

        if (result.status) {
            res.status(200);
            res.send("" + result.token);
        } else {
            res.status(406)
            res.send(result.err);
        }
    }

    async changePassword(req, res) {
        var { token, password } = req.body;

        var isTokenValid = await PasswordToken.validate(token);
    
        if (isTokenValid.status) {

            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200);
            res.send('Senha alterada com sucesso');
        } else {
            res.status(406);
            res.json({err: 'Token inválido!'});
        }
    }

    async login (req, res) {
        var { email, password } = req.body;

        var user = await User.findByEmail(email);

        if(user != undefined) {

            var result = await bcrypt.compare(password, user.password);
        
            if (result) {
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200);
                res.json({ token: token });
            } else {
                res.status(406);
                res.json({ status: false, err: 'Senha incorreta'});
            }
        } else {
            res.status(406);
            res.json({ status: false, err: 'Usuário não existe!' });
        }
    }
}

module.exports = new UserController();