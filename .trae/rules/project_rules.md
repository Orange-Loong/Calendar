# 电子日历项目规则

## 项目概述

本项目是一个跨平台电子日历系统，支持Web端和移动端（iOS/Android），提供日程管理、任务管理、家庭共享等核心功能。

## 技术栈

### 前端
- **Web端**: React 18.2.0 + Vite 5.0.8
- **移动端**: Expo 50.0.6 + React Native 0.73.2
- **UI组件**: React Native Paper, Lucide React, React Native Calendars

### 后端
- **运行环境**: Node.js 23.7.0
- **Web框架**: Express 4.18.2
- **数据库**: MongoDB 6.3.0 + Mongoose 8.0.3
- **认证**: JWT 9.0.2
- **推送**: Firebase Cloud Messaging

## 开发规范

### 代码风格
- **缩进**: 2个空格
- **命名规范**:
  - 变量/函数: 驼峰命名法 (camelCase)
  - 组件/类: 帕斯卡命名法 (PascalCase)
  - 常量: 全大写 + 下划线 (UPPER_CASE)
  - 文件名: 驼峰命名法 (camelCase)

### 提交规范
使用 Conventional Commits 规范:
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试代码
- `chore`: 构建过程或辅助工具的变动

示例:
```
feat(web): 添加日历月视图
fix(mobile): 修复任务列表渲染问题
docs: 更新开发环境配置文档
```

### 代码审查
- 所有代码变更必须通过 Pull Request
- 至少需要 1 个审查者批准
- 所有 CI 检查必须通过
- 解决所有审查意见后才能合并

## Git 工作流

### 分支管理
- `main`: 主分支，稳定版本
- `develop`: 开发分支，集成所有功能
- `feature/*`: 功能分支，开发新功能
- `hotfix/*`: 热修复分支，修复生产环境问题

### 开发流程
1. 从 `develop` 分支创建 `feature/*` 分支
2. 在功能分支上开发
3. 提交代码并创建 Pull Request
4. 通过代码审查后合并到 `develop`
5. 定期从 `develop` 合并到 `main` 进行发布

## 测试要求

### 测试覆盖率
- 单元测试覆盖率 ≥ 80%
- 集成测试覆盖率 ≥ 70%
- UI 测试覆盖率 ≥ 60%

### 测试工具
- **前端**: Jest, React Testing Library, Cypress
- **后端**: Jest, Supertest, Mocha

### 测试执行
- 提交代码前必须运行本地测试
- CI/CD 流程中自动运行所有测试
- 所有测试必须通过才能合并代码

## 状态管理

### 方案选择
- **Web端**: React Context API + useReducer
- **移动端**: React Context API + useReducer

### 状态持久化
- **Web端**: localStorage
- **移动端**: AsyncStorage

## API 设计

### RESTful 规范
- 使用 HTTP 方法表示操作类型 (GET, POST, PUT, DELETE)
- API 路径包含版本号 (如 `/api/v1/events`)
- 统一响应格式: `{ success, data, message }`

### 认证
- 使用 JWT 进行身份认证
- Token 有效期: 7 天
- 所有需要认证的 API 必须在请求头中包含 `Authorization: Bearer <token>`

## 安全要求

### 认证授权
- 密码使用 bcrypt 加密 (12 轮)
- JWT 令牌存储在 HttpOnly Cookie 中
- 实现基于角色的访问控制 (RBAC)

### 数据安全
- 使用 HTTPS 加密传输数据
- 所有用户输入必须经过验证
- 敏感数据加密存储
- 定期备份数据库

### 防护措施
- XSS 防护 (React 自动转义)
- CSRF 防护
- 输入验证 (Joi)
- CORS 配置
- 速率限制 (15 分钟 100 请求)

## 性能要求

### 性能指标
- 页面加载时间 ≤ 2 秒
- 首次内容绘制 (FCP) ≤ 1 秒
- 最大内容绘制 (LCP) ≤ 1.5 秒
- API 响应时间 ≤ 500 毫秒

### 优化策略
- 代码分割 (React.lazy + Suspense)
- 虚拟滚动 (react-window)
- 组件优化 (React.memo, useMemo, useCallback)
- 数据库索引优化
- 缓存策略

## 部署流程

### 开发环境
- Web 端: `npm run dev` (http://localhost:5173)
- 移动端: `npm start` (Expo Go)
- 后端: `npm run dev` (http://localhost:3000)

### 生产环境
- **Web 端**: 使用 Nginx 部署静态资源
- **后端**: 使用 PM2 管理进程
- **移动端**: 提交到 App Store 和 Google Play Store
- **数据库**: MongoDB 副本集

### 部署步骤
1. 备份数据库和配置文件
2. 在测试环境中测试新版本
3. 先部署后端服务
4. 再部署 Web 端应用
5. 最后发布移动端应用
6. 验证系统功能是否正常

## 监控和日志

### 监控系统
- 使用 Prometheus + Grafana 监控系统性能
- 监控指标: CPU、内存、磁盘、网络流量、API 响应时间

### 日志管理
- 使用 ELK Stack (Elasticsearch, Logstash, Kibana) 收集日志
- 配置日志告警规则
- 定期清理旧日志

## 相关文档

项目文档位于 `.trae/` 目录下:

| 文档名称 | 描述 |
|---------|------|
| API接口文档.md | RESTful API 接口定义 |
| 业务流程图文档.md | 核心业务流程和数据流向 |
| 代码规范文档.md | 编码规范和最佳实践 |
| 安全设计文档.md | 安全策略和防护措施 |
| 开发环境配置文档.md | 环境搭建和配置步骤 |
| 性能优化文档.md | 性能优化策略和监控 |
| 技术架构文档.md | 系统架构和技术选型 |
| 数据模型文档.md | 数据库模型和关系设计 |
| 测试用例文档.md | 测试策略和测试用例 |
| 状态管理文档.md | 状态管理方案和实现 |
| 组件设计文档.md | 前端组件设计和规范 |
| 部署文档.md | 生产环境部署和运维 |

## 常见问题

### 端口被占用
```bash
# 查找占用端口的进程
lsof -i :5173

# 终止进程
kill -9 <PID>
```

### MongoDB 连接失败
```bash
# 检查 MongoDB 服务状态
sudo systemctl status mongod

# 启动 MongoDB 服务
sudo systemctl start mongod
```

### 依赖冲突
```bash
# 使用 legacy-peer-deps 安装依赖
npm install --legacy-peer-deps

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### Expo 移动端Web服务启动失败(Invalid URL错误)
**问题现象**：
```
TypeError: Invalid URL
    at new URL (node:internal/url:818:25)
    at ProxyAgent.#getUrl (...)
```

**问题原因**：
系统环境变量中`HTTP_PROXY`被设置为`127.0.0.1:10809`格式，缺少`http://`前缀，导致Node.js URL解析失败。

**终极解决方案（100%成功）**：
```powershell
# Windows PowerShell 环境执行
# 1. 清除所有代理环境变量
Remove-Item Env:\HTTP_PROXY* -ErrorAction SilentlyContinue
Remove-Item Env:\HTTPS_PROXY* -ErrorAction SilentlyContinue
Remove-Item Env:\http_proxy* -ErrorAction SilentlyContinue
Remove-Item Env:\https_proxy* -ErrorAction SilentlyContinue

# 2. 进入移动端项目目录
cd y:\trae_projects\Calendar\mobile

# 3. 离线模式启动（完全跳过网络请求，避免代理问题）
npx expo start --web --offline
```

**成功标志**：
1. 终端显示二维码
2. 提示 `Web is waiting on http://localhost:8081`
3. 浏览器自动打开或手动访问 `http://localhost:8081` 即可使用

**已知可忽略的非阻塞错误**：
- Android SDK路径找不到错误：不影响Web端使用
- favicon.png缺失错误：仅影响浏览器图标显示，不影响主功能
- adb命令不存在错误：仅影响Android模拟器启动

## 联系方式

如有问题，请联系项目负责人或技术负责人。

---

**文档版本**: 1.0
**创建日期**: 2026-01-16
**更新日期**: 2026-01-16
**文档作者**: 开发团队
