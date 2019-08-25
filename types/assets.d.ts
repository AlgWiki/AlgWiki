declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const path: string;
  export default path;
}

declare module '*.md' {
  const readme: string;
  export default readme;
}
