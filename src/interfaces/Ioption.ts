export interface RenameOption {
  from: string;
  to: string;
}export interface RenameParams {
  fromExt: string[];
  toExt: string;
}

export interface ServeOption {
  port: number;
  cors: boolean;
  dir: string;
}
export interface HomeOption {
  python?: string;
  git?: string;
  dart?: string;
}
