# tool

> A small tool, containing many features.

## install

```shell
pnpm add -g @yzqdev/tool
//or
npm i -g @yzqdev/tool
//or 
yarn global add @yzqdev/tool
```

## Usage

```text
➜ tool -h
Usage: tool <command> [options]

Options:
  -v, --version    当前版本.
  -m, --message    帮助
  -h, --help       如何使用

Commands:
  serve [options]  一个web服务器
  md               对markdown文件的操作
  reg              设置环境变量
  file             一些文件操作
  home [options]   打开git仓库地址
  cmd              显示常用的cmd命令
```

## 开发
```
bun link --link-native-bins 或者直接bun link
# 然后就可以直接执行 tool命令了
```

## License

MIT License © 2022 [yzqdev](https://github.com/yzqdev)
