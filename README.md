# React Data Fetching Architecture Example

👻 Live Demo：[點我看 demo](https://react-data-fetching-architecture-ex.vercel.app/)

> 本專案是文章 [**大型 React 專案中 API 層的演進與分層設計**](https://doreentseng.github.io/posts/2026-03-18-react-data-fetching-architecture/) 的配套範例程式碼。


一個展示 React 應用中資料獲取最佳實踐的範例專案，使用 TanStack Query (React Query) 與分層架構設計，提供完整的錯誤處理、重試策略和降級機制。

## 專案特色

- **分層架構設計**：API → Service → Hook → Component 四層架構
- **完整錯誤處理**：統一的錯誤類別系統與使用者友善的錯誤訊息
- **智能重試策略**：自動識別可重試錯誤，採用指數退避 (Exponential Backoff) 演算法 
- **降級處理機制**：當部分 API 失敗時提供降級方案，確保核心功能可用
- **Mock Service Worker**：使用 MSW 模擬 API，無需後端即可開發和測試
- **React Query 整合**：充分利用 cache、背景更新和樂觀更新 (Optimistic Updates) 等功能

## Technical Stack

- **React 19** - JavaScript Library
- **TanStack Query (React Query) v5** - 資料獲取和狀態管理
- **Axios** - HTTP 客戶端
- **MSW (Mock Service Worker) v2** - API 模擬
- **Vite** - 建置工具

## 架構說明

### 分層架構

```
┌─────────────────────────────────────────┐
│          Component Layer                │  展示層：處理 UI 渲染和使用者互動
│         (StudentDashboard)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Hook Layer                   │  Hook 層：封裝 React Query 邏輯
│  (useStudents, useDeleteStudent)        │  - 定義查詢/變更配置
└─────────────────┬───────────────────────┘  - 設定重試策略
                  │                          - 管理 cache 邏輯
┌─────────────────▼───────────────────────┐
│          Service Layer                  │  Service 層：處理業務邏輯
│         (studentService)                │  - 組合多個 API 呼叫
└─────────────────┬───────────────────────┘  - 資料轉換和整合
                  │                          - 降級處理
┌─────────────────▼───────────────────────┐  - 業務驗證
│            API Layer                    │  API 層：純粹的 HTTP 請求
│          (studentApi)                   │  - 呼叫後端 API
└─────────────────────────────────────────┘  - 不含業務邏輯
```

### 資料流向

**查詢流程**（Query）：
```
Component → Hook → Service → API → 後端
   ↑                                   │
   └───────────────────────────────────┘
         (透過 React Query 回傳)
```

**變更流程**（Mutation）：
```
Component → Hook → Service → API → 後端
                     ↓
              onSuccess/onError
                     ↓
            invalidateQueries (更新 cache)
```

## 目錄結構

```
src/
├── components/           # React 元件
│   └── StudentDashboard.jsx
├── hooks/               # Custom Hooks (React Query)
│   ├── useStudents.js        # 查詢學生列表
│   └── useDeleteStudent.js   # 刪除學生
├── services/            # 業務邏輯層
│   ├── studentService.js     # 學生相關業務邏輯
│   └── classService.js       # 班級相關業務邏輯
├── apis/               # API 呼叫層
│   ├── studentApi.js         # 學生 API
│   └── classApi.js           # 班級 API
├── lib/                # 工具庫
│   ├── axiosClient.js        # Axios 實例配置
│   └── errors.js             # 錯誤處理類別
└── mocks/              # MSW Mock 資料
    ├── browser.js            # MSW 瀏覽器配置
    └── handlers.js           # API Mock 處理器
```

## 核心概念

### 1. 錯誤處理

定義了三種錯誤類別：

```javascript
// 應用程式基礎錯誤
class AppError extends Error

// 網路連線錯誤
class NetworkError extends AppError

// 業務邏輯錯誤
class BusinessError extends AppError
```

提供統一的錯誤訊息轉換：

```javascript
getUserFriendlyMessage(error) // 將任何錯誤轉為使用者友善訊息
```

### 2. 重試策略

在 Hook 層設定智能重試邏輯：

```javascript
// 僅重試以下錯誤：
- 網路錯誤 (NetworkError)
- 伺服器錯誤 (5xx)
- 特定狀態碼 (408, 429, 503)

// 重試配置：
- 最多重試 3 次
- 指數退避延遲：1s → 2s → 4s (最多 30s)
```

### 3. 降級處理

當多個 API 呼叫時，部分失敗不影響核心功能：

```javascript
// 範例：取得學生資料 + 班級資料
// 如果班級 API 失敗，仍返回學生資料，班級顯示 "Unknown"
try {
  const [students, classes] = await Promise.all([...])
  return enrichedData
} catch {
  // 降級：只返回學生資料
  return studentsWithDefaultClass
}
```

### 4. React Query 的 cache 管理

```javascript
// 查詢配置
queryKey: ['students']       // cache 鍵值
staleTime: 1000 * 60        // 資料保鮮 1 分鐘

// 變更後自動更新
onSuccess: () => {
  queryClient.invalidateQueries(['students'])  // 刪除後重新取得列表
}
```

## 安裝與執行

### 環境需求

- Node.js v22.21.1 (建議使用 nvm 切換版本)

### 安裝

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 http://localhost:5173 啟動，並自動啟用 MSW 模擬 API。

### 建置

```bash
npm run build
```

### 預覽建置結果

```bash
npm run preview
```

## 使用範例

### 查詢資料

```javascript
import { useStudents } from '@/hooks/useStudents'

function MyComponent() {
  const { data, isLoading, isError, error, refetch } = useStudents()

  if (isLoading) return <div>載入中...</div>
  if (isError) return <div>{getUserFriendlyMessage(error)}</div>

  return <div>{data.map(student => ...)}</div>
}
```

### 資料變更

```javascript
import { useDeleteStudent } from '@/hooks/useDeleteStudent'

function MyComponent() {
  const { mutate: deleteStudent, isPending } = useDeleteStudent({
    onSuccess: () => {
      alert('刪除成功')
    }
  })

  return (
    <button
      onClick={() => deleteStudent(studentId)}
      disabled={isPending}
    >
      刪除
    </button>
  )
}
```

## 延伸閱讀

- [TanStack Query 官方文件](https://tanstack.com/query/latest)
- [MSW 官方文件](https://mswjs.io/)
- [Axios 官方文件](https://axios-http.com/)

## 授權

MIT License