import { CreateCountryDto } from './create-country.dto';

describe('CreateCountryDto', () => {
  it('should be defined', () => {
    expect(new CreateCountryDto()).toBeDefined();
  });
});
