export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_Path = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GET_USER_INFO: '/auth/getuser',
  },
  DASHBOARD: {
    GET_USER_DATA: '/dashboard',
  },
  INCOME: {
    ADD_INCOME: '/income/add',
    GET_ALL_INCOME: '/income/getall',
    DELETE_INCOME: (incomeId) => `/income/${incomeId}`,
    DOWNLOAD_INCOME: '/income/downloadexcel',
  },
  EXPENSE: {
    ADD_EXPENSE: '/expense/add',
    GET_ALL_EXPENSE: '/expense/getall',
    DELETE_EXPENSE: (expenseId) => `/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: '/expense/downloadexcel',
  },
  IMAGE: {
    UPLOAD_IMAGE: '/auth/upload-image',
  },
  SPENDINGINSIGHTS: {
    GET_INSIGHTS: '/insights/spending-insights',
  },
  BUDGET: {
    CREATE_BUDGET: '/budget',
    GET_ALL_BUDGETS: '/budget',
    GET_BUDGET_BY_ID: (id) => `/budget/${id}`,
    DELETE_BUDGET: (id) => `/budget/${id}`,
    UPDATE_CATEGORY_SPENDING: (categoryId) => `/budget/category/${categoryId}/spend`,
  },
  AI_Integeration: {
    PARSE_TRANSACTIONS: '/parse-transactions',
  },
};
