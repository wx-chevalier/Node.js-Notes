/**
 * @Controller('/user')
 * class User{
 *    @Get('/:id')
 *    @Description('获取用户信息')
 *    getUserInfo(){}
 * }
 * @param description 接口描述
 */
import { RouterService } from "@services";
import { apiDescriptionMapKey } from "@utils";
export const Description = (description: string): Function => {
  return (
    target: object | any,
    propertyKey: string,
    descriptor: ParameterDecorator
  ) => {
    RouterService.DescriptionMap.set(
      apiDescriptionMapKey(target, propertyKey),
      description
    );
  };
};
