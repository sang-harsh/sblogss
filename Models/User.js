const UserSchema = require('../Schemas/User');
const bycrypt = require('bcrypt');


class User {
      username;
      email;
      phone;
      name;
      password;

      constructor({ name, username, email, password, phone }) {
            this.name = name;
            this.username = username;
            this.email = email;
            this.password = password;
            this.phone = phone;
      }

      static verifyUserNameAndEmailExists({ username, email, phone }) {
            return new Promise(async (resolve, reject) => {
                  try {
                        const user = await UserSchema.findOne({ $or: [{ username }, { email }, { phone }] });
                        if (user && user.email === email) {
                              return reject('Email Already Exists');
                        }
                        if (user && user.username === username) {
                              return reject('username Already Exists');
                        }
                        if (user && user.phone === phone) {
                              return reject('phone Already Exists');
                        }
                        resolve();
                  } catch (error) {
                        return reject(error);
                  }
            })
      }
      registerUser(){
            return new Promise( async (resolve, reject) => {
                  const hashPassword = await bycrypt.hash(this.password, 15);
                  const user = UserSchema({
                        name : this.name,
                        username : this.username,
                        email : this.email,
                        password : this.password,
                        phone : this.phone
                  });

                  try {
                        const dbUser = await user.save();
                        return resolve(dbUser);
                  } catch (error) {
                        return reject(error);
                  }
            });
      };
}

module.exports = User;