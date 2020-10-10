/**
 * Create a parameters decorators
 */
import { Metadata, ParamsType } from "@common";
import { ParamsService } from "@services";
import { toArray, getClassName } from "@utils";

const decorate = (
  target: Object,
  propertyKey: string,
  parameterIndex: number,
  paramsKey: string,
  type: ParamsType
) => {
  let paramsMap = ParamsService.paramsMap;
  // 拼接map字符key 类名_方法名
  let paramsMapKey = ParamsService.fomartParamsMapKey(target, propertyKey);
  let paramsValueList = toArray(paramsMap.get(paramsMapKey));
  // 按照序列填充数组
  paramsValueList[parameterIndex] = {
    parameterIndex,
    paramsType: type,
    paramsKey
  };
  ParamsService.paramsMap.set(paramsMapKey, paramsValueList);
};

export const RequestParam = (paramsKey: string | any): ParameterDecorator => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.QUERYPARAMS
    );
  };
};

export const RequestBody = (paramsKey?: string | any) => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.BODYPARAMS
    );
  };
};

export const PathVariable = (paramsKey: string | any) => {
  return (target: Object, propertyKey: string, parameterIndex: number): any => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.PATHPARAMS
    );
  };
};

export const Response = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.RESPONSE);
  };
};

export const Request = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.REQUEST);
  };
};

export const HeaderParams = (paramsKey: string | any = "") => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(
      target,
      propertyKey,
      parameterIndex,
      paramsKey,
      ParamsType.HEADERPARAMS
    );
  };
};

export const Next = () => {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.NEXT);
  };
};

export const Err = () => {
  return (
    target: object | any,
    propertyKey: string,
    parameterIndex: number
  ) => {
    decorate(target, propertyKey, parameterIndex, "", ParamsType.ERROR);
  };
};
