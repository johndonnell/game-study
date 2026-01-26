/**
 * ShurikenProjectile
 * Handles rendering for shuriken projectiles (SHURIKEN weapon)
 */
export default class ShurikenProjectile {
  /**
   * Draw shuriken projectile on graphics object
   * @param {Phaser.GameObjects.Graphics} graphics - Graphics object to draw on
   */
  static draw(graphics) {
    // Shuriken - 4-pointed spinning star
    const outerRadius = 10;
    const innerRadius = 4;
    
    // Draw 4 blades
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2); // 0, 90, 180, 270 degrees
      
      // Calculate blade points
      const tipX = Math.cos(angle) * outerRadius;
      const tipY = Math.sin(angle) * outerRadius;
      
      const leftAngle = angle - Math.PI / 8;
      const rightAngle = angle + Math.PI / 8;
      
      const leftBaseX = Math.cos(leftAngle) * innerRadius;
      const leftBaseY = Math.sin(leftAngle) * innerRadius;
      
      const rightBaseX = Math.cos(rightAngle) * innerRadius;
      const rightBaseY = Math.sin(rightAngle) * innerRadius;
      
      // Main blade (dark grey metal)
      graphics.fillStyle(0x4a5568, 1);
      graphics.fillTriangle(tipX, tipY, leftBaseX, leftBaseY, rightBaseX, rightBaseY);
      
      // Blade edge highlight (lighter grey)
      graphics.fillStyle(0x94a3b8, 1);
      const edgeTipX = Math.cos(angle) * (outerRadius - 1.5);
      const edgeTipY = Math.sin(angle) * (outerRadius - 1.5);
      const edgeLeftX = Math.cos(leftAngle) * (innerRadius + 0.5);
      const edgeLeftY = Math.sin(leftAngle) * (innerRadius + 0.5);
      graphics.fillTriangle(edgeTipX, edgeTipY, leftBaseX, leftBaseY, edgeLeftX, edgeLeftY);
    }
    
    // Center circle (darker metal)
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(0, 0, 3.5);
    
    // Center hole
    graphics.fillStyle(0x000000, 0.8);
    graphics.fillCircle(0, 0, 1.5);
    
    // Metallic ring
    graphics.lineStyle(1, 0x94a3b8, 1);
    graphics.strokeCircle(0, 0, 2.5);
  }
  
  /**
   * Check if this projectile should rotate to face direction
   * @returns {boolean} True if should rotate
   */
  static shouldRotate() {
    return false;
  }
  
  /**
   * Get rotation speed for spinning projectiles
   * @returns {number} Rotation speed (0 for non-spinning)
   */
  static getRotationSpeed() {
    return 0.15; // Fast spin
  }
}
