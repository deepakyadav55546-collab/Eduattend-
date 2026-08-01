import { GlobalizationService } from './globalization.service';

describe('GlobalizationService', () => {
  const service = new GlobalizationService({} as any);

  it('formats INR for India locale', () => {
    expect(service.formatMoney(1234.5, 'INR', 'en-IN')).toContain('1,234.50');
  });

  it('formats USD for US locale', () => {
    expect(service.formatMoney(1234.5, 'USD', 'en-US')).toContain('$1,234.50');
  });

  it('rejects unsupported currencies', () => {
    expect(() => service.formatMoney(10, 'XYZ')).toThrow();
  });

  it('rejects non-finite amounts', () => {
    expect(() => service.formatMoney(Number.NaN, 'INR')).toThrow();
    expect(() => service.formatMoney(Number.POSITIVE_INFINITY, 'INR')).toThrow();
  });

  it('formats a date in the requested timezone', () => {
    const formatted = service.formatDate(
      '2026-07-31T12:00:00Z',
      'Asia/Kolkata',
      'en-IN',
    );
    expect(formatted).toContain('5:30');
  });
});
