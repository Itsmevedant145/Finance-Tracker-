// utils/apiPath.js

export const API_BASE_URL = 'http://localhost:8000'; // Base URL for the API

export const API_Path = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    GET_USER_INFO: '/api/v1/auth/getuser',
  },

  DASHBOARD: {
    GET_USER_DATA: '/api/v1/dashboard',
  },

  INCOME: {
    ADD_INCOME: '/api/v1/income/add',
    GET_ALL_INCOME: '/api/v1/income/getall',
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_INCOME: '/api/v1/income/downloadexcel',
  },

  EXPENSE: {
    ADD_EXPENSE: '/api/v1/expense/add',
    GET_ALL_EXPENSE: '/api/v1/expense/getall',
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: '/api/v1/expense/downloadexcel',
  },

  IMAGE: {
    UPLOAD_IMAGE: '/api/v1/auth/upload-image',
  },

  SPENDINGINSIGHTS: {
    GET_INSIGHTS: '/api/v1/insights/spending-insights', // Fixed syntax issue here
  },

  // New budget-related API paths
    BUDGET: {
    CREATE_BUDGET: '/api/v1/budget',
    GET_ALL_BUDGETS: '/api/v1/budget',
    GET_BUDGET_BY_ID: (id) => `/api/v1/budget/${id}`,
    DELETE_BUDGET: (id) => `/api/v1/budget/${id}`,
    UPDATE_CATEGORY_SPENDING: (categoryId) => `/api/v1/budget/category/${categoryId}/spend`,
  },
  AI_Integeration: {
    PARSE_TRANSACTIONS: '/api/v1/parse-transactions',
  },

};
