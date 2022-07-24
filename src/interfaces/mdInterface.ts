export interface FileItem {
  name?: string;
  filename: string;
  content: string;
}
export interface DirPath {
  name: string | null | undefined;
  files: FileItem[];
}
export interface SingleDirPath {
  name: string | null | undefined;
  files: string[];
}
export interface FileOptions {
  txt: boolean;
  name: boolean;
}
