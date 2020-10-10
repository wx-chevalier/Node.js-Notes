import { IUserInfo } from "./interface";
const data = require("./data");

export class UserService {
  getUserList() {
    return data["userList"];
  }
  getUserById(id: string) {
    return data["userList"].find(item => item["id"] == id);
  }

  addUser(userInfo: IUserInfo) {
    userInfo.id = "A333";
    return userInfo;
  }
}
