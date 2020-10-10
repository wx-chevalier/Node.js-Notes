import { LennethApplication, ILenneth, ServerSettings } from "../../lib";
import { UserController } from "./user.ontroller";

@ServerSettings({
  port: 8087,
  imports: {
    apis: UserController
  },
  logFileSetting: {
    useFlag: true,
    filename: "app-error.log"
  }
})
export class App extends LennethApplication implements ILenneth {}
