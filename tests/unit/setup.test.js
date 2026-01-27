/**
 * Basic setup test to verify Jest configuration
 */

describe('Project Setup', () => {
  test('Jest is configured correctly', () => {
    expect(true).toBe(true);
  });

  test('jsdom environment is available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  test('Canvas support check', () => {
    const canvas = document.createElement('canvas');
    expect(canvas.getContext).toBeDefined();
  });
});
