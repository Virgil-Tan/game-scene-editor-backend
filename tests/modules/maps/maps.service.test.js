const {prepareTests, shutDownTests} = require("../../helper");
const {UsersService} = require("../../../modules/users/users.service");
const {UsersModel} = require("../../../modules/users/users.model");
const {MapsService} = require("../../../modules/maps/maps.service");

let user = null;
beforeAll(async () => {
  await prepareTests();
  const userData = {
    username: "test_username",
    passwordHash: "test_passwordHash",
    email: "test_email@gmail.com"
  };
  user = await UsersService.createUser(userData);
});

afterAll(async () => {
  await UsersModel.findByIdAndDelete(user._id.toString());
  await shutDownTests();
});



test("Create map", async () => {
  const mapData = {
    name: 'test_map',
    author: user._id
  };
  const map = await MapsService.createMap(mapData);
  const newMap = await MapsService.getMapById(map._id.toString());
  expect(newMap.name).toBe(mapData.name);

  // delete new map
  await MapsService.deleteMap(newMap._id.toString());
});

test("Get maps", async () => {
  const mapData = {
    name: 'test_map',
    author: user._id
  };
  const map = await MapsService.createMap(mapData);

  const maps = await MapsService.getMaps();
  expect(maps.length > 0).toBe(true);
  // delete new map
  await MapsService.deleteMap(map._id.toString());
});
