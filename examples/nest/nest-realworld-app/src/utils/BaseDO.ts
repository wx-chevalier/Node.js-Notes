/* 基础模型，提供基础的数据赋值操作，以及将 createdAt, updatedAt 以及 deletedAt 进行格式转化 */
import dayjs from 'dayjs';
import { upperFirst } from 'lodash';
import { isValidArray } from 'ueact-utils/dist/cjs';

const DATE_TIME_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;

export type Id = 'string';

export class BaseDO {
  // 唯一主键，Snowflake
  id: Id;

  // 共有属性
  // 所属的租户信息
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  readonly _apiBase?: string;

  constructor(props?: {}) {
    if (!props) {
      return;
    }

    this._defineProps(props);

    this._formatDatetime();
  }

  private _defineProps(props: {}) {
    Object.entries(props).forEach(([prop, value]) => {
      let firstSetting = true;
      Object.defineProperty(this, prop, {
        enumerable: true,
        get() {
          return value;
        },
        set(newValue) {
          // firstSetting 用于默认值的设置
          if (firstSetting) {
            firstSetting = false;
            // avoid overriding props for sub class
            // 避免递归覆盖掉子类的属性，子类的创建还是由各子类手动进行
            if (
              (newValue == null ||
                !(isValidArray(newValue)
                  ? newValue.every((v: any) => v instanceof BaseDO)
                  : newValue instanceof BaseDO)) &&
              value != null &&
              !DATE_TIME_FIELDS.includes(
                prop as typeof DATE_TIME_FIELDS[number],
              )
            ) {
              return;
            }
          }
          if (newValue !== undefined) {
            value = newValue;
          }
        },
      });
    });
  }

  private _formatDatetime() {
    DATE_TIME_FIELDS.forEach(field => {
      const value = this[field];

      if (value && typeof value === 'string') {
        const dValue = dayjs(value);
        const uField = upperFirst(field);
        this[field] = dValue.format('YYYY-MM-DD HH:mm');
        this['__' + uField] = dValue;
        this['__raw' + uField] = value;
      }
    });
  }
}
