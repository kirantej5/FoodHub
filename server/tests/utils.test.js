import { getPagination, paginateResponse } from '../utils/apiResponse.js';

describe('Pagination Utilities', () => {
  it('should parse pagination correctly', () => {
    const query = { page: '2', limit: '10' };
    const result = getPagination(query, 20);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(10);
  });

  it('should format paginated response correctly', () => {
    const total = 55;
    const page = 2;
    const limit = 10;
    const result = paginateResponse(total, page, limit);
    
    expect(result.total).toBe(55);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(6);
  });
});
