# 贡献指南

感谢你对 PerComics 的关注！我们欢迎任何形式的贡献。

## 🎯 贡献方式

### 1. 添加新漫画（最常见）

这是最简单也是最受欢迎的贡献方式！请查看 [README.md](README.md) 中的 [如何贡献新漫画](README.md#-如何贡献新漫画) 章节。

**快速流程**：
```
Fork → 克隆 → 添加漫画 → 测试 → 提交 → 推送 → 创建 PR
```

### 2. 修复问题

- 浏览 [Issues](https://github.com/yourusername/PerComics/issues)
- 选择感兴趣的问题
- 在 Issue 中评论表明你想要解决
- Fork 并开始开发
- 提交 PR 并引用相关 Issue

### 3. 提出新功能

- 先在 [Issues](https://github.com/yourusername/PerComics/issues) 中讨论你的想法
- 等待维护者反馈
- 获得批准后再开始开发
- 提交 PR

## 📋 提交规范

### Commit 消息格式

我们推荐使用以下格式：

```
<类型>: <简短描述>

<详细说明>（可选）
```

**类型**：
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**：
```bash
# 添加漫画
git commit -m "添加漫画：《一拳超人》"

# 修复 Bug
git commit -m "fix: 修复章节列表排序错误"

# 新功能
git commit -m "feat: 添加书签功能"

# 文档更新
git commit -m "docs: 更新贡献指南"
```

### Pull Request 标题

- **添加漫画**: `添加漫画：《漫画名称》`
- **修复 Bug**: `fix: 修复 XXX 问题`
- **新功能**: `feat: 添加 XXX 功能`
- **文档**: `docs: 更新 XXX 文档`

## ✅ 提交前检查清单

### 添加漫画

- [ ] 包含封面图片
- [ ] 创建 meta.json
- [ ] 章节命名规范
- [ ] 图片命名规范
- [ ] 本地测试通过
- [ ] 构建无错误
- [ ] 仅修改 comics/ 目录

### 代码改动

- [ ] 代码符合项目风格
- [ ] 添加必要的注释
- [ ] 通过所有测试
- [ ] 更新相关文档
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告

## 🚫 注意事项

### 禁止事项

- ❌ 不要修改其他贡献者的漫画
- ❌ 不要提交受版权保护的内容（除非你有权利）
- ❌ 不要在 PR 中包含无关的文件修改
- ❌ 不要提交过大的文件（单张图片 > 5MB）
- ❌ 不要修改核心代码（除非你知道你在做什么）

### 文件大小限制

- 单张图片：建议 < 500KB，最大 < 5MB
- 单次 PR：建议 < 100MB

如果漫画较大，请考虑：
- 压缩图片
- 分多个 PR 提交
- 使用 WebP 格式

## 🎨 代码风格

### TypeScript

```typescript
// 使用 interface 定义类型
interface Comic {
  id: string;
  title: string;
}

// 使用箭头函数
const MyComponent: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};

// 使用 const 而不是 let
const [state, setState] = useState(false);
```

### 命名规范

- **组件**: PascalCase (`ImageLoader.tsx`)
- **文件**: camelCase (`constants.ts`)
- **变量**: camelCase (`comicList`)
- **常量**: UPPER_SNAKE_CASE (`API_URL`)
- **类型**: PascalCase (`Comic`, `Chapter`)

## 🧪 测试

在提交 PR 前，请确保：

```bash
# 开发服务器正常运行
npm run dev

# 构建成功
npm run build

# 预览构建产物
npm run preview
```

## 📞 需要帮助？

如果你在贡献过程中遇到任何问题：

- 💬 在相关 Issue 或 PR 中提问
- 📧 发送邮件到维护者
- 📖 查看 [README.md](README.md) 中的常见问题

## 🙏 感谢

感谢每一位贡献者！你的贡献让 PerComics 变得更好。

---

**Happy Contributing!** 🎉
