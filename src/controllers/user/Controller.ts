import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, request } from 'express';
import UserRepository from '../../repositories/user/UserRepository';
import * as bcrypt from 'bcrypt';
import config from '../../config/configuration';
import compareHashPassword from '../../libs/utilities';

const userRepository = new UserRepository();
class UserController {
    static instance: UserController;
    static getInstance() {
        if (UserController.instance) {
            return UserController.instance;
        }
        UserController.instance = new UserController();
        return UserController.instance;
    }
    me(req: any, res: Response, next: NextFunction) {
        const { user } = req;
        return res.status(200).send({ message: 'Me', status: 'ok', data: user });
    }
    login(req: Request, res: Response, next: NextFunction) {

        try {
            const { email, password } = req.body;
            userRepository.findOne({ email })            
                .then((data) => {
                    if (data !== null) {
                        if (compareHashPassword(password)) {         
                                              
                            const token = jwt.sign({ data }, config.secretKey, {
                              expiresIn: '15m'
                            });
                            res.send({
                                data: token,
                                message: 'Login successfully',
                                status: 200
                            });
                        }
                    }
                        else {
                            res.send({
                                message: 'Password Doesnt Match',
                                status: 400
                            });
                        }
                });
            } catch (err) {
                  res.status(200).send({ message: 'Inside error block', error: err });
        res.send(err);
    }

}
}
export default UserController.getInstance();

