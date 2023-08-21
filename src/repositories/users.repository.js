const { UserDto } = require("../dto/user.dto");

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  usersPaginate = async (pagina) => {
    let result = await this.dao.usersPaginate(pagina);
    return result;
  };

  async getUsers() {
    return await this.dao.getUsers();
  }

  async getById(uid) {
    return await this.dao.getById(uid);
  }

  create = async (newUser) => {
    let userToCreate = new UserDto(newUser);
    let result = await this.dao.create(userToCreate);
    return result;
  };

  async update(uid, userUpdate) {
    return await this.dao.update(uid, userUpdate);
  }

  async delete(uid) {
    return await this.dao.delete(uid);
  }

  async loginSession(email) {
    return await this.dao.loginSession(email);
  }
}

module.exports = {
  UserRepository,
};
