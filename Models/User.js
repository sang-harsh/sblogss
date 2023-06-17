const UserSchema = require('../Schemas/User');
const bcrypt = require('bcrypt');
const validator = require('validator');
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
      registerUser() {
            return new Promise(async (resolve, reject) => {
                  const hashPassword = await bcrypt.hash(this.password, 15);
                  const user = UserSchema({
                        name: this.name,
                        username: this.username,
                        email: this.email,
                        password: hashPassword,
                        phone: this.phone
                  });

                  try {
                        const dbUser = await user.save();
                        return resolve(dbUser);
                  } catch (error) {
                        return reject(error);
                  }
            });
      };

      static loginUser({ loginId, password }) {
            return new Promise(async (resolve, reject) => {
                  //let dbUser;
                  //optimse for below conditions
                  let dbUser = await UserSchema.findOne({ $or: [{ email: loginId }, { username: loginId }] });

                  //user 1 - s@s.com
                  //user 2 - s@s.com

                  //user 2 - s@s.com , sang
                  //user 2 - k@k.com , s@s.com
                  // if (validator.isEmail(loginId)) {
                  //       dbUser = await UserSchema.findOne({ email: loginId });
                  // } else {
                  //       dbUser = await UserSchema.findOne({ username: loginId });
                  // }
                  if (!dbUser) {
                        return reject("No user is found");
                  }
                  const isMatch = await bcrypt.compare(password, dbUser.password);
                  if (!isMatch) {
                        return reject("NO USER MATCH");
                  }
                  resolve({
                        username: dbUser.username,
                        name: dbUser.name,
                        email: dbUser.email
                  });
            });

      }

      static verifyUserIdExists({ userId }) {
            return new Promise(async (resolve, reject) => {
                  try {
                        //here check input
                        const userDb = await UserSchema.findOne({ _id: userId });
                        resolve(userDb);
                  } catch (error) {
                        reject(error);
                  }
            });
      }
}

module.exports = User;