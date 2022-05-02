import { ResourceHandlerMiddleware } from './resource-handler.middleware';

describe('ResourceHandlerMiddleware', () => {
  it('should be defined', () => {
    expect(new ResourceHandlerMiddleware()).toBeDefined();
  });
});
