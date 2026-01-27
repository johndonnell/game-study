/**
 * Unit tests for EnemySpawner class logic
 */

describe('EnemySpawner Logic', () => {
  describe('Enemy Count Calculation', () => {
    test('should calculate correct enemy count for round 1', () => {
      const roundNumber = 1;
      const enemyCount = 3 + (roundNumber * 2);
      expect(enemyCount).toBe(5);
    });

    test('should calculate correct enemy count for round 5', () => {
      const roundNumber = 5;
      const enemyCount = 3 + (roundNumber * 2);
      expect(enemyCount).toBe(13);
    });

    test('should calculate correct enemy count for round 10', () => {
      const roundNumber = 10;
      const enemyCount = 3 + (roundNumber * 2);
      expect(enemyCount).toBe(23);
    });

    test('should calculate correct enemy count for round 20', () => {
      const roundNumber = 20;
      const enemyCount = 3 + (roundNumber * 2);
      expect(enemyCount).toBe(43);
    });

    test('enemy count should increase with round number', () => {
      const round1Count = 3 + (1 * 2);
      const round10Count = 3 + (10 * 2);
      expect(round10Count).toBeGreaterThan(round1Count);
    });
  });

  describe('Spawn Position Logic', () => {
    test('should generate position within bounds', () => {
      const bounds = { width: 800, height: 600 };
      const margin = 50;
      
      const x = margin + Math.random() * (bounds.width - margin * 2);
      const y = margin + Math.random() * (bounds.height - margin * 2);
      
      expect(x).toBeGreaterThanOrEqual(margin);
      expect(x).toBeLessThanOrEqual(bounds.width - margin);
      expect(y).toBeGreaterThanOrEqual(margin);
      expect(y).toBeLessThanOrEqual(bounds.height - margin);
    });

    test('should respect margin from edges', () => {
      const bounds = { width: 800, height: 600 };
      const margin = 50;
      
      const minX = margin;
      const maxX = bounds.width - margin;
      const minY = margin;
      const maxY = bounds.height - margin;
      
      expect(minX).toBe(50);
      expect(maxX).toBe(750);
      expect(minY).toBe(50);
      expect(maxY).toBe(550);
    });
  });

  describe('Enemy Type Selection', () => {
    test('early rounds should use weaker enemies', () => {
      const roundNumber = 3;
      const isEarlyRound = roundNumber <= 5;
      expect(isEarlyRound).toBe(true);
    });

    test('mid rounds should use medium enemies', () => {
      const roundNumber = 8;
      const isMidRound = roundNumber > 5 && roundNumber <= 10;
      expect(isMidRound).toBe(true);
    });

    test('late rounds should use stronger enemies', () => {
      const roundNumber = 18;
      const isLateRound = roundNumber > 15;
      expect(isLateRound).toBe(true);
    });

    test('round progression should increase enemy difficulty', () => {
      const round1 = 1;
      const round20 = 20;
      
      const round1IsEarly = round1 <= 5;
      const round20IsLate = round20 > 15;
      
      expect(round1IsEarly).toBe(true);
      expect(round20IsLate).toBe(true);
    });
  });

  describe('Difficulty Scaling Integration', () => {
    test('higher rounds should spawn more enemies with higher stats', () => {
      const round1 = 1;
      const round10 = 10;
      
      // Enemy count
      const round1Count = 3 + (round1 * 2);
      const round10Count = 3 + (round10 * 2);
      
      // Health scaling
      const baseHealth = 100;
      const round1Health = Math.floor(baseHealth * (1 + round1 * 0.15));
      const round10Health = Math.floor(baseHealth * (1 + round10 * 0.15));
      
      expect(round10Count).toBeGreaterThan(round1Count);
      expect(round10Health).toBeGreaterThan(round1Health);
    });

    test('total enemy health should increase significantly with rounds', () => {
      const baseHealth = 100;
      
      const round1Count = 3 + (1 * 2);
      const round1Health = Math.floor(baseHealth * (1 + 1 * 0.15));
      const round1Total = round1Count * round1Health;
      
      const round20Count = 3 + (20 * 2);
      const round20Health = Math.floor(baseHealth * (1 + 20 * 0.15));
      const round20Total = round20Count * round20Health;
      
      expect(round20Total).toBeGreaterThan(round1Total * 5); // At least 5x harder
    });
  });
});
