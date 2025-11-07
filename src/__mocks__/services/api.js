// Mock do serviço de API para testes
const mockApi = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    headers: {
      Authorization: null,
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export default mockApi;
export const RECAPTCHA_TOKEN = '6LcDvHEaAAAAADExXf46EMayH7sxiPcyxMm9Cjrl';

