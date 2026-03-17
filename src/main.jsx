// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. 定義啟動 Mocking 的函式
async function enableMocking() {
  // 只有在開發環境或 Demo 環境才啟動 MSW
  // 如果你希望在 StackBlitz 恆啟動，可以直接 import
  const { worker } = await import('@/mocks/browser');
  
  // start() 會回傳一個 Promise
  return worker.start({
    // 遇到沒有攔截到的請求時，選擇忽略而不報警告（bypass）
    onUnhandledRequest: 'bypass',
  });
}

// 2. 先執行啟動邏輯，完成後再執行 render
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})