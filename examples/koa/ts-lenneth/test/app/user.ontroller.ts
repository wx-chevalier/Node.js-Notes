import {
  Controller,
  Autowired,
  Get,
  Post,
  UseBefore,
  Response,
  TResponse,
  RequestBody,
  PathVariable,
  Multer
} from "../../lib";
import { UserService } from "./user.service";
import { UserRuleAuth, UserAddAuth } from "./middleware";
import { IUserInfo } from "./interface";

@Controller("/user")
export class UserController {
  @Autowired()
  userService: UserService;

  @Get("/list")
  @Multer()
  @UseBefore(UserRuleAuth)
  async getUserList(@Response() response: TResponse) {
    response.body = this.userService.getUserList();
  }

  @Get("/detail/:id")
  @UseBefore(UserRuleAuth)
  async getUserDetail(
    @PathVariable("id") id: string,
    @Response() response: TResponse
  ) {
    response.body = this.userService.getUserById(id);
  }

  @Post("/add")
  @UseBefore(UserAddAuth)
  async addUser(
    @RequestBody() userData: IUserInfo,
    @Response() response: TResponse
  ) {
    response.body = this.userService.addUser(userData);
  }
}
