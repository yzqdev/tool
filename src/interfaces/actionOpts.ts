export interface FilesizeOpts {
  fs?: unknown;
  ignore?: RegExp;
  strict?: boolean;
}
export interface FilesizeResult {
  size: number;
  all: number;
  folder: number;
  num: number;
  errors: Error[];
}
