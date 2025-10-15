# 贡献指南

感谢你对 ReactLynxUse 项目的关注！

## 关于 ReactLynx

ReactLynxUse 是为 [ReactLynx](https://lynxjs.org/react) 量身打造的，ReactLynx 是 [Lynx](https://lynxjs.org) 上的地道 React。在贡献之前，我们建议：

- 了解 Lynx 和 ReactLynx 的基础知识
- 阅读 [Thinking in ReactLynx](https://lynxjs.org/react/thinking-in-reactlynx.html)
- 熟悉 ReactLynx 的双线程模型

本项目基于 [react-use](https://github.com/streamich/react-use)。

## 开发

### 安装依赖

```bash
pnpm install
```

## 测试

运行单元测试：

```bash
pnpm test
```

## 文档

文档站点由 [rspress](https://rspress.rs/) 驱动

```bash
cd website
pnpm dev
```

## 贡献

### 现有 hooks

欢迎增强现有的 hooks！请尽量：

- 在可能的情况下保持向后兼容性
- 为任何新行为或功能添加单元测试
- 更新文档来周知开发者
- 遵循现有的代码风格和模式

## 新 hooks

添加新 hooks 时的一些注意事项：

- 开始之前：最好先开一个 issue 讨论你的想法
- 实现：在 `src` 目录中添加你的 hook 文件（例如：`src/useNewHook.ts`）
- 测试：在 `tests` 目录中编写单元测试（例如：`tests/useNewHook.test.ts`）
- 文档：在 `website/docs/zh` 目录中添加中文文档
- 导出：别忘了在 `src/index.ts` 中导出你的 hook

## 代码风格

不用太担心代码风格问题 - 我们的 linting 和 formatting 工具会帮助保持一致性。

## 致谢

再次感谢你对本项目的关注！
