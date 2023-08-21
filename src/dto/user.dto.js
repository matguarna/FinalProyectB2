class UserDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.gender = user.gender ? (user.gender = user.gender) : "null";
    this.password = user.password;
    this.username = user.username;
    this.role = user.role;
  }
}

module.exports = {
  UserDto,
};
