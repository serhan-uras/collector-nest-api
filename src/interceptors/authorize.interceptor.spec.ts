import { AuthorizeInterceptor } from './authorize.interceptor';

describe('AuthorizeInterceptor', () => {
  it('should be defined', () => {
    expect(new AuthorizeInterceptor()).toBeDefined();
  });
});
