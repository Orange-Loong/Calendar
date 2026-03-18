# 电子日历API接口文档

## 一、文档概述

本文档详细定义了电子日历系统的API接口，包括认证、用户管理、日程管理、任务管理和家庭共享等模块。文档采用RESTful API设计风格，使用HTTP方法表示操作类型，包含请求/响应格式和示例。

## 二、API设计原则

1. **RESTful API**：使用HTTP方法（GET, POST, PUT, DELETE）表示操作类型
2. **版本控制**：API路径包含版本号（如/api/v1/events）
3. **统一响应格式**：所有API返回统一的响应格式
4. **错误处理**：使用HTTP状态码和错误信息描述错误
5. **认证授权**：使用JWT进行身份认证

## 三、统一响应格式

### 1. 成功响应

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

### 2. 错误响应

```json
{
  "success": false,
  "data": null,
  "message": "错误信息"
}
```

## 四、HTTP状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 五、认证机制

### 1. JWT认证

- 所有需要认证的API必须在请求头中包含`Authorization: Bearer <token>`
- Token有效期为7天
- 刷新Token机制：使用`/api/v1/auth/refresh`获取新Token

## 六、API接口列表

### 1. 认证相关API

#### 1.1 用户注册

**URL**：`/api/v1/auth/register`
**方法**：POST
**描述**：用户注册

**请求体**：
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123",
  "phone": "13800138000"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

#### 1.2 用户登录

**URL**：`/api/v1/auth/login`
**方法**：POST
**描述**：用户登录

**请求体**：
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

#### 1.3 刷新Token

**URL**：`/api/v1/auth/refresh`
**方法**：POST
**描述**：刷新Token
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token刷新成功"
}
```

#### 1.4 用户退出

**URL**：`/api/v1/auth/logout`
**方法**：POST
**描述**：用户退出登录
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": null,
  "message": "退出成功"
}
```

### 2. 用户管理API

#### 2.1 获取当前用户信息

**URL**：`/api/v1/users/me`
**方法**：GET
**描述**：获取当前用户信息
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138000",
      "createdAt": "2026-01-12T00:00:00.000Z"
    }
  },
  "message": ""
}
```

#### 2.2 更新用户信息

**URL**：`/api/v1/users/me`
**方法**：PUT
**描述**：更新当前用户信息
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "name": "张三",
  "phone": "13800138001"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138001",
      "createdAt": "2026-01-12T00:00:00.000Z"
    }
  },
  "message": "用户信息更新成功"
}
```

#### 2.3 修改密码

**URL**：`/api/v1/users/change-password`
**方法**：PUT
**描述**：修改密码
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
```

**响应**：
```json
{
  "success": true,
  "data": null,
  "message": "密码修改成功"
}
```

### 3. 日程管理API

#### 3.1 获取日历数据

**URL**：`/api/v1/calendar/{view}/{date}`
**方法**：GET
**描述**：获取指定视图和日期的日历数据
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- view: 视图类型（day, week, month）
- date: 日期（格式：YYYY-MM-DD）

**响应**：
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "会议",
        "description": "项目会议",
        "startTime": "2026-01-12T09:00:00.000Z",
        "endTime": "2026-01-12T10:00:00.000Z",
        "location": "会议室A",
        "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "participants": ["65a1b2c3d4e5f6g7h8i9j0k1"],
        "isAllDay": false,
        "repeat": "none",
        "reminder": 15,
        "createdAt": "2026-01-10T00:00:00.000Z"
      }
    ]
  },
  "message": ""
}
```

#### 3.2 创建日程

**URL**：`/api/v1/events`
**方法**：POST
**描述**：创建新日程
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "title": "会议",
  "description": "项目会议",
  "startTime": "2026-01-12T09:00:00.000Z",
  "endTime": "2026-01-12T10:00:00.000Z",
  "location": "会议室A",
  "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "participants": ["65a1b2c3d4e5f6g7h8i9j0k1"],
  "isAllDay": false,
  "repeat": "none",
  "reminder": 15
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "会议",
      "description": "项目会议",
      "startTime": "2026-01-12T09:00:00.000Z",
      "endTime": "2026-01-12T10:00:00.000Z",
      "location": "会议室A",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "participants": ["65a1b2c3d4e5f6g7h8i9j0k1"],
      "isAllDay": false,
      "repeat": "none",
      "reminder": 15,
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  },
  "message": "日程创建成功"
}
```

#### 3.3 获取日程详情

**URL**：`/api/v1/events/{id}`
**方法**：GET
**描述**：获取指定日程的详细信息
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 日程ID

**响应**：
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "会议",
      "description": "项目会议",
      "startTime": "2026-01-12T09:00:00.000Z",
      "endTime": "2026-01-12T10:00:00.000Z",
      "location": "会议室A",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "participants": ["65a1b2c3d4e5f6g7h8i9j0k1"],
      "isAllDay": false,
      "repeat": "none",
      "reminder": 15,
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  },
  "message": ""
}
```

#### 3.4 更新日程

**URL**：`/api/v1/events/{id}`
**方法**：PUT
**描述**：更新指定日程
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 日程ID

**请求体**：
```json
{
  "title": "更新后的会议",
  "description": "更新后的项目会议",
  "startTime": "2026-01-12T10:00:00.000Z",
  "endTime": "2026-01-12T11:00:00.000Z"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "event": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "更新后的会议",
      "description": "更新后的项目会议",
      "startTime": "2026-01-12T10:00:00.000Z",
      "endTime": "2026-01-12T11:00:00.000Z",
      "location": "会议室A",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "participants": ["65a1b2c3d4e5f6g7h8i9j0k1"],
      "isAllDay": false,
      "repeat": "none",
      "reminder": 15,
      "createdAt": "2026-01-10T00:00:00.000Z",
      "updatedAt": "2026-01-11T00:00:00.000Z"
    }
  },
  "message": "日程更新成功"
}
```

#### 3.5 删除日程

**URL**：`/api/v1/events/{id}`
**方法**：DELETE
**描述**：删除指定日程
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 日程ID

**响应**：
```json
{
  "success": true,
  "data": null,
  "message": "日程删除成功"
}
```

### 4. 任务管理API

#### 4.1 获取任务列表

**URL**：`/api/v1/tasks`
**方法**：GET
**描述**：获取任务列表，包括task、schedule、note三种类型
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**查询参数**：
- status: 任务状态（all, completed, pending），默认all
- sortBy: 排序字段（endDate, createdAt），默认endDate
- order: 排序顺序（asc, desc），默认asc
- taskType: 任务类型（all, task, schedule, note），默认all
- date: 日期（格式：YYYY-MM-DD），按日期筛选

**响应**：
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k4",
        "title": "完成项目报告",
        "description": "完成2025年项目报告",
        "taskType": "task",
        "endDate": "2026-01-15T00:00:00.000Z",
        "startTime": "09:00",
        "endTime": "17:00",
        "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
        "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "checkerId": "65a1b2c3d4e5f6g7h8i9j0k5",
        "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "completed": false,
        "approved": false,
        "priority": "high",
        "reward": "",
        "rewardType": "",
        "points": 10,
        "punishment": "",
        "createdAt": "2026-01-10T00:00:00.000Z"
      },
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "title": "周例会",
        "description": "每周一上午的项目例会",
        "taskType": "schedule",
        "startDate": "2026-01-15T00:00:00.000Z",
        "endDate": "2026-12-31T00:00:00.000Z",
        "startTime": "10:00",
        "endTime": "11:00",
        "recurrence": "weekly",
        "isRecurring": true,
        "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
        "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "completed": false,
        "priority": "medium",
        "createdAt": "2026-01-10T00:00:00.000Z"
      },
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "title": "会议纪要",
        "description": "记录今天会议的重要事项",
        "taskType": "note",
        "endDate": "2026-01-15T00:00:00.000Z",
        "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
        "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
        "createdAt": "2026-01-10T00:00:00.000Z"
      }
    ]
  },
  "message": ""
}
```

#### 4.2 创建任务

**URL**：`/api/v1/tasks`
**方法**：POST
**描述**：创建新任务，支持task、schedule、note三种类型
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体（task类型）**：
```json
{
  "title": "完成项目报告",
  "description": "完成2025年项目报告",
  "taskType": "task",
  "endDate": "2026-01-15T00:00:00.000Z",
  "startTime": "09:00",
  "endTime": "17:00",
  "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
  "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "priority": "high",
  "reward": "",
  "rewardType": "",
  "points": 10,
  "punishment": ""
}
```

**请求体（schedule类型）**：
```json
{
  "title": "周例会",
  "description": "每周一上午的项目例会",
  "taskType": "schedule",
  "startDate": "2026-01-15T00:00:00.000Z",
  "endDate": "2026-12-31T00:00:00.000Z",
  "startTime": "10:00",
  "endTime": "11:00",
  "recurrence": "weekly",
  "isRecurring": true,
  "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
  "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
  "priority": "medium"
}
```

**请求体（note类型）**：
```json
{
  "title": "会议纪要",
  "description": "记录今天会议的重要事项",
  "taskType": "note",
  "endDate": "2026-01-15T00:00:00.000Z",
  "familyId": "65a1b2c3d4e5f6g7h8i9j0k3"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "title": "完成项目报告",
      "description": "完成2025年项目报告",
      "taskType": "task",
      "endDate": "2026-01-15T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "17:00",
      "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "completed": false,
      "priority": "high",
      "reward": "",
      "punishment": "",
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  },
  "message": "任务创建成功"
}
```

#### 4.3 更新任务

**URL**：`/api/v1/tasks/{id}`
**方法**：PUT
**描述**：更新指定任务
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 任务ID

**请求体**：
```json
{
  "title": "更新后的项目报告",
  "description": "更新后的2025年项目报告",
  "dueDate": "2026-01-16T00:00:00.000Z"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "title": "更新后的项目报告",
      "description": "更新后的2025年项目报告",
      "dueDate": "2026-01-16T00:00:00.000Z",
      "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "completed": false,
      "priority": "high",
      "repeat": "none",
      "reward": "",
      "punishment": "",
      "createdAt": "2026-01-10T00:00:00.000Z",
      "updatedAt": "2026-01-11T00:00:00.000Z"
    }
  },
  "message": "任务更新成功"
}
```

#### 4.4 切换任务状态

**URL**：`/api/v1/tasks/{id}/toggle`
**方法**：PUT
**描述**：切换任务的完成状态
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 任务ID

**响应**：
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "title": "更新后的项目报告",
      "description": "更新后的2025年项目报告",
      "dueDate": "2026-01-16T00:00:00.000Z",
      "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "completed": true,
      "priority": "high",
      "repeat": "none",
      "reward": "",
      "punishment": "",
      "createdAt": "2026-01-10T00:00:00.000Z",
      "updatedAt": "2026-01-11T00:00:00.000Z"
    }
  },
  "message": "任务状态更新成功"
}
```

#### 4.5 删除任务

**URL**：`/api/v1/tasks/{id}`
**方法**：DELETE
**描述**：删除指定任务
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 任务ID

**响应**：
```json
{
  "success": true,
  "data": null,
  "message": "任务删除成功"
}
```

#### 4.6 审批任务

**URL**：`/api/v1/tasks/{id}/approve`
**方法**：PUT
**描述**：审批任务完成情况
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 任务ID

**请求体**：
```json
{
  "approved": true,
  "comment": ""
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "title": "完成项目报告",
      "description": "完成2025年项目报告",
      "dueDate": "2026-01-15T00:00:00.000Z",
      "assignedTo": "65a1b2c3d4e5f6g7h8i9j0k1",
      "creatorId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "familyId": "65a1b2c3d4e5f6g7h8i9j0k3",
      "completed": true,
      "approved": true,
      "priority": "high",
      "repeat": "none",
      "reward": "",
      "rewardType": "",
      "points": 10,
      "punishment": "",
      "createdAt": "2026-01-10T00:00:00.000Z",
      "updatedAt": "2026-01-11T00:00:00.000Z"
    }
  },
  "message": "任务审批成功"
}
```

### 5. 家庭共享API

#### 5.1 创建家庭组

**URL**：`/api/v1/families`
**方法**：POST
**描述**：创建新的家庭组
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "name": "我的家庭"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "family": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "name": "我的家庭",
      "members": ["65a1b2c3d4e5f6g7h8i9j0k1"],
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  },
  "message": "家庭组创建成功"
}
```

#### 5.2 获取家庭组列表

**URL**：`/api/v1/families`
**方法**：GET
**描述**：获取用户所属的家庭组列表
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "families": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "name": "我的家庭",
        "members": ["65a1b2c3d4e5f6g7h8i9j0k1"],
        "createdAt": "2026-01-10T00:00:00.000Z"
      }
    ]
  },
  "message": ""
}
```

#### 5.3 邀请家庭成员

**URL**：`/api/v1/families/{id}/invite`
**方法**：POST
**描述**：邀请家庭成员
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 家庭组ID

**请求体**：
```json
{
  "email": "lisi@example.com",
  "phone": "13800138002"
}
```

**响应**：
```json
{
  "success": true,
  "data": null,
  "message": "邀请已发送"
}
```

#### 5.4 接受邀请

**URL**：`/api/v1/families/accept-invite`
**方法**：POST
**描述**：接受家庭组邀请
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "inviteCode": "ABC123"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "family": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "name": "我的家庭",
      "members": ["65a1b2c3d4e5f6g7h8i9j0k1", "65a1b2c3d4e5f6g7h8i9j0k5"],
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  },
  "message": "邀请接受成功"
}
```

#### 5.5 获取家庭成员

**URL**：`/api/v1/families/{id}/members`
**方法**：GET
**描述**：获取家庭组成员列表
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**路径参数**：
- id: 家庭组ID

**响应**：
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k1",
        "name": "张三",
        "email": "zhangsan@example.com",
        "phone": "13800138000"
      },
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k5",
        "name": "李四",
        "email": "lisi@example.com",
        "phone": "13800138002"
      }
    ]
  },
  "message": ""
}
```

### 6. 积分管理API

#### 6.1 获取用户积分

**URL**：`/api/v1/points`
**方法**：GET
**描述**：获取当前用户的积分信息
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "totalPoints": 100,
    "dailyEarned": 20,
    "dailyLimit": 50
  },
  "message": ""
}
```

#### 6.2 获取积分历史

**URL**：`/api/v1/points/history`
**方法**：GET
**描述**：获取积分变动历史
**认证**：需要在请求头中包含`Authorization: Bearer <token>`
**查询参数**：
- page: 页码，默认1
- limit: 每页数量，默认20
- startDate: 开始日期（格式：YYYY-MM-DD）
- endDate: 结束日期（格式：YYYY-MM-DD）

**响应**：
```json
{
  "success": true,
  "data": {
    "pointsHistory": [
      {
        "id": "65a1b2c3d4e5f6g7h8i9j0k6",
        "taskId": "65a1b2c3d4e5f6g7h8i9j0k4",
        "points": 10,
        "type": "earn",
        "status": "approved",
        "description": "完成任务：完成项目报告",
        "createdAt": "2026-01-11T00:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  },
  "message": ""
}
```

#### 6.3 兑换积分

**URL**：`/api/v1/points/redeem`
**方法**：POST
**描述**：兑换积分
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**请求体**：
```json
{
  "rewardType": "gift",
  "points": 50,
  "description": "兑换礼品"
}
```

**响应**：
```json
{
  "success": true,
  "data": {
    "transactionId": "65a1b2c3d4e5f6g7h8i9j0k7",
    "remainingPoints": 50
  },
  "message": "积分兑换成功"
}
```

#### 6.4 获取兑换选项

**URL**：`/api/v1/points/redeem-options`
**方法**：GET
**描述**：获取积分兑换选项
**认证**：需要在请求头中包含`Authorization: Bearer <token>`

**响应**：
```json
{
  "success": true,
  "data": {
    "options": [
      {
        "id": "gift",
        "name": "礼品",
        "points": 50,
        "description": "兑换精美礼品"
      },
      {
        "id": "schoolBag",
        "name": "校包",
        "points": 100,
        "description": "兑换优质校包"
      },
      {
        "id": "other",
        "name": "其他",
        "points": 20,
        "description": "其他奖励"
      }
    ]
  },
  "message": ""
}
```

## 七、错误码定义

| 错误码 | 描述 |
|--------|------|
| 40001 | 请求参数错误 |
| 40002 | 邮箱已被注册 |
| 40003 | 手机号已被注册 |
| 40101 | 未授权 |
| 40102 | 无效的Token |
| 40103 | Token已过期 |
| 40301 | 禁止访问 |
| 40401 | 资源不存在 |
| 50001 | 服务器错误 |
| 50002 | 数据库错误 |

## 八、API测试

推荐使用Postman或类似工具进行API测试，测试时需要注意：

1. 首先调用注册或登录API获取Token
2. 在请求头中添加`Authorization: Bearer <token>`
3. 按照文档中的请求格式发送请求
4. 验证响应格式和数据是否符合预期

## 九、文档更新记录

| 版本 | 更新日期 | 更新内容 |
|------|----------|----------|
| v1.1 | 2026-02-09 | 添加任务审批API和积分管理API，支持任务奖励机制和积分系统 |
| v1.0 | 2026-01-12 | 初始版本，包含认证、用户、日程、任务和家庭共享API |

## 十、总结

本文档详细定义了电子日历系统的API接口，包括认证、用户管理、日程管理、任务管理、笔记管理、Meal&Grocery管理、家庭共享和积分管理等模块。文档采用RESTful API设计风格，使用HTTP方法表示操作类型，包含请求/响应格式和示例。开发团队应严格按照本文档进行API开发，确保前后端交互的一致性和可靠性。

---

**文档版本**：1.2
**创建日期**：2026-01-12
**更新日期**：2026-01-16
**文档作者**：开发团队
**审核状态**：待审核
**审核人**：技术负责人