declare module '*.svg' {
  const content: unknown;
  export default content;
}

declare module '*.module.less' {
  const content: unknown;
  export = content;
}

declare module '*.less' {
  const content: unknown;
  export = content;
}

declare interface IPagingData<T> {
  data: T[];
  total: number;
}
