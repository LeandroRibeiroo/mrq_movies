export const EventEmitter = {
  addListener: jest.fn(),
  removeListener: jest.fn(),
  emit: jest.fn(),
};

export const requireNativeModule = jest.fn(() => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  emit: jest.fn(),
}));

export const requireOptionalNativeModule = jest.fn(() => ({
  addListener: jest.fn(),
  removeListener: jest.fn(),
  emit: jest.fn(),
}));

export default {
  EventEmitter,
  requireNativeModule,
  requireOptionalNativeModule,
};
