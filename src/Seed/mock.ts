import * as  bcrypt from 'bcrypt';
import config from '../config/configuration';
import hashFunction from "../libs/utilities"


const user1 = {
    name: 'Head Trainer',
    role: 'head-trainer',
    email: 'headtrainer@successive.tech',
    password: hashFunction()
};

const user2 = {
    name: 'Trainee',
    role: 'Trainee',
    email: 'trainee@successive.tech',
    password: hashFunction()
};

export default {user1, user2};