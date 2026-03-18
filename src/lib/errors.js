/**
 * 統一錯誤處理類別
 * 用於在應用程式中標準化錯誤處理
 */

/**
 * 應用程式基礎錯誤類別
 */
export class AppError extends Error {
  constructor(message, code, statusCode, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.code = code; // 業務錯誤碼
    this.statusCode = statusCode; // HTTP 狀態碼
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}

/**
 * 網路連線錯誤
 * 當無法連接到伺服器時使用
 */
export class NetworkError extends AppError {
  constructor(message = '網路連線失敗，請檢查您的網路設定', originalError = null) {
    super(message, 'NETWORK_ERROR', null, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * 業務邏輯錯誤
 * 當業務邏輯驗證失敗時使用
 */
export class BusinessError extends AppError {
  constructor(message, code = 'BUSINESS_ERROR', originalError = null) {
    super(message, code, 400, originalError);
    this.name = 'BusinessError';
  }
}

/**
 * 判斷是否為可重試的錯誤
 */
export const isRetryableError = (error) => {
  // 網路錯誤可重試
  if (error instanceof NetworkError) return true;

  // 如果是 axios 錯誤且沒有 response，代表是網路問題
  if (error.response === undefined && error.request) return true;

  // 伺服器 5xx 錯誤可重試
  if (error.response?.status >= 500) return true;

  // 408 (請求逾時), 429 (請求過多), 503 (服務無法使用) 可重試
  const retryableStatus = [408, 429, 503];
  if (retryableStatus.includes(error.response?.status)) return true;

  return false;
};

/**
 * 取得使用者友善的錯誤訊息
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    return error.message;
  }

  // axios 錯誤
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;

    if (message) return message;

    switch (status) {
      case 400:
        return '請求資料格式錯誤';
      case 401:
        return '登入已過期，請重新登入';
      case 403:
        return '您沒有權限執行此操作';
      case 404:
        return '找不到請求的資源';
      case 500:
        return '伺服器發生錯誤，請稍後再試';
      default:
        return '請求失敗，請稍後再試';
    }
  }

  // 網路錯誤
  if (error.request) {
    return '網路連線失敗，請檢查您的網路設定';
  }

  // 未知錯誤
  return error.message || '發生未預期的錯誤，請稍後再試';
};
