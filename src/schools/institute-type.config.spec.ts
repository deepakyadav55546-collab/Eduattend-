import { INSTITUTE_UI_CONFIG, InstituteType } from './institute-type.config';

describe('Institute type configuration', () => {
  it('provides configuration for every supported institute type', () => {
    for (const type of Object.values(InstituteType)) {
      expect(INSTITUTE_UI_CONFIG[type]).toBeDefined();
      expect(INSTITUTE_UI_CONFIG[type].modules.length).toBeGreaterThan(0);
    }
  });

  it('keeps attendance and reports available to every institute', () => {
    for (const config of Object.values(INSTITUTE_UI_CONFIG)) {
      expect(config.modules).toContain('attendance');
      expect(config.modules).toContain('reports');
    }
  });
});
