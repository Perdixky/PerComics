# PerComics

一个现代化、优雅的在线漫画阅读器，采用 React + TypeScript + Vite 构建，支持自托管部署。

> 💡 **想要添加你喜欢的漫画？** 欢迎提交 PR！详见 [🤝 如何贡献新漫画](#-如何贡献新漫画)

## ✨ 功能特性

- 📚 **漫画库管理** - 清晰的网格视图展示所有漫画
- 📖 **流畅阅读体验** - 纵向滚动阅读，自动加载所有页面
- 🎨 **精美的 UI 设计** - 基于 Framer Motion 的流畅动画效果
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🌙 **暗色主题** - 护眼的暗色阅读界面
- 🔖 **章节导航** - 快速切换章节，显示阅读进度
- ⚡ **图片预加载** - 打开章节后自动加载所有图片，无需滚动触发
- 🎯 **标签系统** - 支持漫画分类和筛选
- 🤖 **AI 智能排序** - 自动识别各种章节命名格式，完美排序

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **动画**: Framer Motion
- **图标**: Lucide React
- **部署**: Cloudflare Pages
- **样式**: Tailwind CSS (内联样式)
- **AI 排序**: Transformers.js + LaMini-Flan-T5-77M (77M参数)

## 🤝 如何贡献新漫画

本项目采用 Fork + Pull Request 的协作模式，任何人都可以通过提交 PR 来添加新漫画！

> 📖 **详细贡献指南**: 请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

### 前置要求

- Git 版本控制工具
- Node.js 16.7+ (需要支持 `fs.cpSync`)
- npm 或 yarn
- GitHub 账号

### 贡献流程概览

```
Fork 项目 → 克隆到本地 → 添加漫画 → 测试验证 → 提交 Commit → 推送到 Fork → 创建 PR
```

### 详细步骤

#### 1️⃣ Fork 项目到你的账号

1. 访问项目仓库页面
2. 点击右上角的 **Fork** 按钮
3. 等待 Fork 完成，你的账号下会出现一个副本

#### 2️⃣ 克隆你的 Fork 到本地

```bash
# 替换为你的 GitHub 用户名
git clone https://github.com/YOUR_USERNAME/PerComics.git
cd PerComics
```

#### 3️⃣ 安装依赖

```bash
npm install
```

#### 4️⃣ 添加漫画资源

这是核心步骤！详见下方的 [📚 如何添加新漫画](#-如何添加新漫画) 章节。

简单来说：
```bash
# 在 comics/ 目录中按照规范添加你的漫画文件
mkdir -p comics/你的漫画名称/第001话
# 放置封面、meta.json 和章节图片
```

#### 5️⃣ 本地测试验证

```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:5173
# 检查漫画是否正确显示

# 运行构建测试
npm run build
```

#### 6️⃣ 提交更改

```bash
# 查看添加的文件
git status

# 添加所有新漫画文件到暂存区
git add comics/

# 提交 commit（请使用清晰的提交信息）
git commit -m "添加漫画：《你的漫画名称》"

# 如果添加了多部漫画，可以分开提交
git commit -m "添加漫画：《漫画A》、《漫画B》"
```

**Commit 消息建议格式**：
- `添加漫画：《一拳超人》`
- `添加漫画：《进击的巨人》（1-10话）`
- `更新漫画：《一拳超人》新增第200-205话`
- `修复漫画：《XXX》修正章节顺序`

#### 7️⃣ 推送到你的 Fork

```bash
# 推送到你的远程仓库
git push origin main
```

#### 8️⃣ 创建 Pull Request

1. 访问你的 Fork 仓库页面（`https://github.com/YOUR_USERNAME/PerComics`）
2. GitHub 会自动提示 "Compare & pull request"，点击它
3. 填写 PR 信息：
   - **标题**：简洁明了，如 `添加漫画：《一拳超人》`
   - **描述**：请使用以下模板：
     ```markdown
     ## 📚 添加的漫画

     - 《一拳超人》（1-50话）
     - 《进击的巨人》（1-20话）

     ## ✅ 检查清单

     - [x] 已包含封面图片（cover.jpg/png/webp）
     - [x] 已创建 meta.json 元数据文件
     - [x] 章节文件夹命名规范（使用数字前缀）
     - [x] 图片文件命名规范（按顺序排列）
     - [x] 本地测试通过（`npm run dev`）
     - [x] 构建无错误（`npm run build`）
     - [x] 仅修改 comics/ 目录

     ## 📝 其他说明

     （可选）添加任何额外的说明，比如漫画来源、特殊情况等
     ```
4. 点击 **Create pull request**
5. 等待维护者审核和合并

**注意事项**：
- ⚠️ 请确保仅修改 `comics/` 目录，不要修改其他代码文件
- ⚠️ 请确保漫画内容符合版权规定
- ⚠️ 大型 PR（超过 100MB）可能需要分批提交

#### 9️⃣ 等待审核和自动部署

- PR 提交后，维护者会进行审核
- 审核通过并合并后，**自动部署流程会将更新发布到线上**
- 你添加的漫画将自动出现在网站上！

### 后续更新

如果你想继续添加更多漫画：

```bash
# 确保本地代码是最新的
git pull upstream main  # 如果配置了 upstream
# 或者
git pull origin main

# 添加新漫画...
# 重复步骤 4-8
```

### 配置 Upstream（可选但推荐）

配置上游仓库可以方便地同步主仓库的最新更改：

```bash
# 添加原始仓库为 upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/PerComics.git

# 同步主仓库的最新更改
git fetch upstream
git merge upstream/main

# 推送到你的 Fork
git push origin main
```

## 📚 如何添加新漫画

这是本项目的核心功能！按照以下详细步骤，你可以轻松添加自己的漫画收藏。

### 📂 第一步：理解目录结构

项目会自动扫描 `comics/` 目录下的所有漫画。每个漫画的标准目录结构如下：

```
comics/
└── 漫画名称/                    # 漫画文件夹（文件夹名作为漫画ID）
    ├── cover.jpg               # 封面图片（必需）
    ├── meta.json               # 元数据文件（推荐）
    ├── 第001话/                 # 章节文件夹
    │   ├── 001.jpg
    │   ├── 002.jpg
    │   ├── 003.jpg
    │   └── ...
    ├── 第002话/
    │   └── ...
    └── 第003话/
        └── ...
```

### 📝 第二步：准备漫画资源

#### 1. 创建漫画文件夹

在 `comics/` 目录下创建一个新文件夹，文件夹名称将作为漫画的唯一标识符（ID）。

```bash
mkdir -p comics/我的漫画
```

**命名建议**：
- ✅ 使用漫画的官方中文名称
- ✅ 可以使用中文、英文、数字
- ❌ 避免使用特殊字符（如 `/ \ : * ? " < > |`）
- 示例：`一拳超人`、`进击的巨人`、`Naruto`

#### 2. 添加封面图片

在漫画文件夹根目录下，放置一张名为 `cover` 的图片文件。

```bash
# 封面图片必须以 cover 开头，支持以下格式：
comics/我的漫画/cover.jpg    ✅
comics/我的漫画/cover.png    ✅
comics/我的漫画/cover.webp   ✅
comics/我的漫画/cover.jpeg   ✅
comics/我的漫画/cover.avif   ✅
```

**封面图片建议**：
- 推荐尺寸：600×900 像素（2:3 比例）
- 支持格式：`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`
- 文件大小：建议小于 1MB
- 如果没有封面，系统会使用占位符图片

#### 3. 创建元数据文件 (可选但强烈推荐)

在漫画文件夹根目录下创建 `meta.json` 文件：

```bash
touch comics/我的漫画/meta.json
```

使用以下模板填写漫画信息：

```json
{
  "title": "我的漫画",
  "author": "作者名称",
  "description": "这是一部精彩的漫画，讲述了...",
  "status": "连载中",
  "tags": ["动作", "冒险", "热血"]
}
```

**字段说明**：

| 字段 | 类型 | 必需 | 说明 | 默认值 |
|------|------|------|------|--------|
| `title` | string | 否 | 显示的漫画标题 | 文件夹名称 |
| `author` | string | 否 | 作者名称 | "Unknown Author" |
| `description` | string | 否 | 漫画简介 | "No description available." |
| `status` | string | 否 | 连载状态 | "Ongoing" |
| `tags` | array | 否 | 标签列表 | ["Imported"] |

**示例 - 完整的 meta.json**：

```json
{
  "title": "一拳超人",
  "author": "ONE / 村田雄介",
  "description": "主人公埼玉原本是一名整日奔波于求职的普通人。3年前的一天偶然遇到了要对淘气少年下杀手的异变螃蟹人后，回忆起年少年时「想要成为英雄」的梦想，最终拼尽全力救下了淘气少年。重拾对于成为英雄的兴趣之后，通过3年特训终于脱胎换骨获得了最强的力量，但同时失去了全部头发成了光头，似乎还失去了某些感情。",
  "status": "连载中",
  "tags": ["动作", "热血", "超级英雄", "搞笑"]
}
```

#### 4. 组织章节和图片

在漫画文件夹下为每个章节创建单独的文件夹：

```bash
mkdir -p comics/我的漫画/第001话
mkdir -p comics/我的漫画/第002话
mkdir -p comics/我的漫画/第003话
```

**章节文件夹命名规则（🤖 AI 智能识别）**：

系统使用 AI 驱动的智能排序，支持各种命名格式：

**标准章节**（自动识别）：
- ✅ `Chapter 123` / `Ch 123` / `Episode 123` / `Ep 123`
- ✅ `第123话` / `123话` / `第123集` / `第123章`
- ✅ `001`, `002`, `150` (纯数字)
- ✅ `#123`, `123-标题`

**特殊章节**（智能分类）：
- ✅ `Prologue` / `序章` → 自动排在最前面
- ✅ `Epilogue` / `尾声` / `终章` → 自动排在最后
- ✅ `Extra` / `Bonus` / `番外` / `特别篇` → 排在普通章节之后
- ✅ `Side Story 1` / `番外01` → 带编号的特殊章节
- ✅ `Chapter 1.5` / `Ch 2.3` → 小数章节（插话）

**工作原理**：
- 📏 90%+ 的章节通过快速规则引擎识别（毫秒级）
- 🤖 复杂命名启用 AI 模型理解（仅在必要时）
- 🛡️ 无法识别的章节自动使用自然排序作为回退
- 🌍 支持中英文混合命名

**查看详细说明**：[CHAPTER_SORTING.md](CHAPTER_SORTING.md)

**示例命名**：
```
comics/一拳超人/
├── Prologue          → 识别为序章 (排序: 0)
├── Chapter 1         → 识别为第1章 (排序: 1)
├── Chapter 1.5       → 识别为插话 (排序: 1.5)
├── 第123话           → 识别为第123章 (排序: 123)
├── Extra - 夏日特辑  → 识别为特别篇 (排序: 9000)
└── Epilogue          → 识别为尾声 (排序: 9999)
```

**放置章节图片**：

在每个章节文件夹中放置该章节的所有页面图片：

```bash
comics/我的漫画/第001话/
├── 001.jpg
├── 002.jpg
├── 003.jpg
├── 004.jpg
└── ...
```

**图片命名和格式**：
- 支持格式：`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`
- 命名建议：使用数字前缀保证顺序（`001.jpg`, `002.jpg`）
- 系统会自动进行自然排序
- 图片会按照文件名顺序显示

### ✅ 第三步：验证和构建

#### 1. 验证目录结构

确保你的漫画文件夹结构正确：

```bash
tree comics/我的漫画 -L 2

# 预期输出示例：
# comics/我的漫画/
# ├── cover.jpg
# ├── meta.json
# ├── 第001话/
# │   ├── 001.jpg
# │   ├── 002.jpg
# │   └── ...
# ├── 第002话/
# │   └── ...
# └── 第003话/
#     └── ...
```

#### 2. 运行构建命令

```bash
npm run build
```

构建过程会：
1. 扫描 `comics/` 目录
2. 读取所有漫画的元数据和章节信息
3. 生成 `dist/manifest.json` 文件
4. 将 `comics/` 文件夹复制到 `dist/comics/`

**构建输出示例**：
```
📚 Scanning comics directory...
✅ Manifest generated at: /path/to/dist/manifest.json
📂 Copying comics to build folder...
✅ Comics copied successfully.
```

#### 3. 预览效果

```bash
npm run preview
```

在浏览器中打开预览链接，检查新添加的漫画是否正确显示。

### 🔍 完整示例

让我们通过一个完整的例子来演示如何添加《进击的巨人》：

```bash
# 1. 创建漫画文件夹
mkdir -p comics/进击的巨人

# 2. 添加封面
cp /path/to/cover.jpg comics/进击的巨人/cover.jpg

# 3. 创建元数据
cat > comics/进击的巨人/meta.json << 'EOF'
{
  "title": "进击的巨人",
  "author": "谏山创",
  "description": "百年前，巨人突然出现于世上，人类几乎遭到灭绝。幸存下来的人们建造了三重巨大的城墙，百年来未曾遭遇巨人侵袭。然而，某一天，超大型巨人突然出现，打破了外墙...",
  "status": "已完结",
  "tags": ["动作", "冒险", "黑暗奇幻", "军事"]
}
EOF

# 4. 创建章节文件夹
mkdir -p comics/进击的巨人/第001话
mkdir -p comics/进击的巨人/第002话
mkdir -p comics/进击的巨人/第003话

# 5. 复制图片到各章节
cp /path/to/chapter1/*.jpg comics/进击的巨人/第001话/
cp /path/to/chapter2/*.jpg comics/进击的巨人/第002话/
cp /path/to/chapter3/*.jpg comics/进击的巨人/第003话/

# 6. 构建和预览
npm run build
npm run preview
```

### 📋 检查清单

在提交或部署前，请确保：

- [ ] 漫画文件夹名称合法（无特殊字符）
- [ ] 包含 `cover.jpg` 或其他格式的封面图片
- [ ] （推荐）创建了 `meta.json` 元数据文件
- [ ] 所有章节文件夹名称有序（使用数字前缀）
- [ ] 章节内的图片文件名有序
- [ ] 图片格式正确（jpg/png/webp/gif/avif）
- [ ] 运行 `npm run build` 没有错误
- [ ] 使用 `npm run preview` 验证显示正确

### ⚠️ 常见问题

#### Q: 漫画没有显示在库中？
**A**: 检查以下几点：
1. 漫画文件夹是否在 `comics/` 根目录下
2. 是否至少包含一个章节文件夹
3. 章节文件夹内是否有图片文件
4. 运行 `npm run build` 查看控制台是否有错误

#### Q: 章节顺序不对？
**A**: 系统使用 AI 智能排序，自动识别大多数命名格式：
- 运行 `npm run test-sorter` 查看排序规则演示
- 查看 [CHAPTER_SORTING.md](CHAPTER_SORTING.md) 了解详细说明
- 检查 `dist/manifest.json` 中的 `_meta` 字段查看识别结果
- 标准命名（如 `Chapter 1`, `第001话`）识别率最高
- 复杂命名可能需要首次运行时下载 AI 模型（~200MB）

#### Q: 图片加载很慢？
**A**:
- 优化图片大小（推荐单张 < 500KB）
- 使用 WebP 格式以获得更好的压缩率
- 考虑对大图片进行压缩处理

#### Q: 封面不显示？
**A**:
1. 确保文件名以 `cover` 开头（区分大小写）
2. 检查文件扩展名是否在支持列表中
3. 如果没有封面，系统会自动使用占位符

#### Q: meta.json 格式错误？
**A**:
- 使用 [JSONLint](https://jsonlint.com/) 验证 JSON 格式
- 确保所有字符串使用双引号 `"`
- 确保最后一个字段后没有逗号
- 注意转义特殊字符

#### Q: 如何批量添加多个漫画？
**A**:
你可以编写脚本批量处理：
```bash
#!/bin/bash
# 批量添加脚本示例
for comic_dir in /source/comics/*; do
  comic_name=$(basename "$comic_dir")
  mkdir -p "comics/$comic_name"
  cp -r "$comic_dir"/* "comics/$comic_name/"
done
npm run build
```

## 🏗️ 项目结构

```
PerComics/
├── comics/                # 漫画资源目录（需手动添加）
│   └── 一拳超人/
│       ├── cover.jpg
│       ├── meta.json
│       └── 第001话/
├── components/           # React 组件
│   ├── ImageLoader.tsx  # 图片加载组件
│   └── LoadingSpinner.tsx
├── views/               # 页面视图
│   ├── LibraryView.tsx  # 漫画库页面
│   ├── DetailView.tsx   # 漫画详情页
│   └── ReaderView.tsx   # 阅读器页面
├── App.tsx              # 主应用组件
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 常量配置
├── scan_comics.js       # 漫画扫描脚本
├── index.html
├── index.tsx            # 应用入口
├── package.json
├── tsconfig.json
├── vite.config.ts       # Vite 配置
├── wrangler.jsonc       # Cloudflare Pages 配置
└── dist/                # 构建输出目录
    ├── manifest.json    # 自动生成的漫画清单
    └── comics/          # 复制的漫画资源
```

## 🚀 自动部署

本项目配置了自动部署流程：

- ✅ **主分支自动部署**: 当 PR 被合并到 `main` 分支时，自动触发部署
- ✅ **零配置**: 贡献者无需关心部署细节
- ✅ **即时上线**: 合并后几分钟内漫画就会出现在网站上

### 构建命令

如果你想在本地验证构建：

```bash
npm run build
```

构建产物会输出到 `dist/` 目录，包含：
- 静态 HTML、CSS、JS 文件
- `manifest.json` - 漫画元数据清单
- `comics/` - 所有漫画资源的副本

**注意**: 普通贡献者无需手动构建或部署，只需提交 PR 即可！

## 🧪 开发

### 开发服务器

```bash
npm run dev
```

开发服务器会在 `http://localhost:5173` 启动，支持热模块替换（HMR）。

### 添加测试漫画

在开发时，你可能不想导入完整的漫画。可以使用较少的页面进行测试：

```bash
mkdir -p comics/测试漫画/第001话
# 只放 3-5 张图片用于测试
cp test-images/*.jpg comics/测试漫画/第001话/
```

### 修改扫描脚本

如果需要自定义漫画扫描逻辑，编辑 `scan_comics.js`：

- `COMICS_SRC_DIR`: 漫画源目录
- `ALLOWED_EXTS`: 支持的图片格式
- `naturalSort`: 文件排序逻辑

## 💡 贡献代码/功能

除了添加漫画，你也可以贡献代码改进！

### 功能开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 开发和测试新功能
4. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 开启 Pull Request

### 想要改进的功能

欢迎认领并实现以下功能：

- [ ] 📖 书签和阅读历史记录
- [ ] 🔍 全文搜索功能
- [ ] ⭐ 收藏夹系统
- [ ] 🌓 深色/浅色主题切换
- [ ] 📄 更多阅读模式（双页模式、从右到左）
- [ ] 📱 PWA 支持（离线阅读）
- [ ] 🖼️ 图片懒加载优化
- [ ] ☁️ 自动备份和同步
- [ ] 🔐 用户系统和权限管理
- [ ] 📊 阅读统计

## 📄 许可证

本项目为开源项目，仅供学习和个人使用。

## 📞 问题反馈

如有问题或建议，欢迎：

- 💬 提交 [GitHub Issue](https://github.com/yourusername/PerComics/issues)
- 📧 发送邮件到: your-email@example.com
- 📝 在 PR 中留言讨论

## 🌟 贡献者

感谢所有为本项目做出贡献的朋友！

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- 这里可以使用 all-contributors 机器人自动生成贡献者列表 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

你的名字也可以出现在这里！立即 [提交 PR](#-如何贡献新漫画) 来添加你喜欢的漫画吧！

---

**祝你阅读愉快！** 📖✨
