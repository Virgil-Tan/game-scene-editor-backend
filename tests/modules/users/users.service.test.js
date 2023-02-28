const {prepareTests, shutDownTests} = require("../../helper");
const {UsersService} = require("../../../modules/users/users.service");
const {UsersModel} = require("../../../modules/users/users.model");

beforeAll(async () => {
  await prepareTests();
});

afterAll(async () => {
  await shutDownTests();
});

test("Test create user", async () => {
  const userData = {
    username: "test_username",
    passwordHash: "test_passwordHash",
    email: "test_email@gmail.com"
  };
  const user = await UsersService.createUser(userData);
  expect(user.username).toBe(userData.username);

  // delete new user
  await UsersModel.findByIdAndDelete(user._id.toString());
});

test("Test find user by username", async () => {
  const userData = {
    username: "test_username",
    passwordHash: "test_passwordHash",
    email: "test_email@gmail.com"
  };
  const user = await UsersService.createUser(userData);
  const targetUser = await UsersService.findUserByUsername(userData.username);
  expect(targetUser.email).toBe(userData.email);
  expect(targetUser.username).toBe(userData.username);
  // delete new user
  await UsersModel.findByIdAndDelete(user._id.toString());
});
