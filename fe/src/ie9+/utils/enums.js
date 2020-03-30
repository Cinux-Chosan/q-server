// 枚举类型尽量用 String，某些ui框架会将数字转换成字符串保存

// 排序类型枚举
export const ENUM_SORT_TYPE = {
  NAME: '1',
  SIZE: '2',
  TYPE: '3',
  CREAT_TIME: '4'
};

// 排序方式枚举
export const ENUM_SORT_ORDER = {
  ASC: '1',
  DESC: '-1'
};

// 展现方式枚举
export const ENUM_DISPLAY_TYPE = {
  GRID: 1,
  LIST: 2
};

// 列表方式图标大小
export const ENUM_DISPLAY_SIZE = {
  BIG: 1,
  SMALL: 2
};

// 列表方式是否分页
export const ENUM_DISPLAY_TYPE_LIST_IS_PAGINATION = {
  NO: 0,
  YES: 1
};
