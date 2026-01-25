/**
 * ShurikenSprite
 * Handles sprite creation for Shuriken weapons
 */
export default class ShurikenSprite {
  /**
   * Create shuriken sprite
   * @param {Phaser.Scene} scene - The scene
   * @returns {Phaser.GameObjects.Graphics} Graphics object for the shuriken
   */
  static create(scene) {
    const graphics = scene.add.graphics();
    
    // Shuriken is a 4-pointed throwing star - MUCH LARGER
    const centerX = 0;
    const centerY = 0;
    const outerRadius = 15; // Increased from 8
    const innerRadius = 6;  // Increased from 3
    const bladeWidth = 4;   // Width of each blade
    
    // Draw 4 blades
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2); // 0, 90, 180, 270 degrees
      
      // Calculate blade points
      const tipX = centerX + Math.cos(angle) * outerRadius;
      const tipY = centerY + Math.sin(angle) * outerRadius;
      
      const leftAngle = angle - Math.PI / 8;
      const rightAngle = angle + Math.PI / 8;
      
      const leftBaseX = centerX + Math.cos(leftAngle) * innerRadius;
      const leftBaseY = centerY + Math.sin(leftAngle) * innerRadius;
      
      const rightBaseX = centerX + Math.cos(rightAngle) * innerRadius;
      const rightBaseY = centerY + Math.sin(rightAngle) * innerRadius;
      
      // Main blade (dark grey metal)
      graphics.fillStyle(0x4a5568, 1);
      graphics.fillTriangle(tipX, tipY, leftBaseX, leftBaseY, rightBaseX, rightBaseY);
      
      // Blade edge highlight (lighter grey)
      graphics.fillStyle(0x94a3b8, 1);
      const edgeTipX = centerX + Math.cos(angle) * (outerRadius - 2);
      const edgeTipY = centerY + Math.sin(angle) * (outerRadius - 2);
      const edgeLeftX = centerX + Math.cos(leftAngle) * (innerRadius + 1);
      const edgeLeftY = centerY + Math.sin(leftAngle) * (innerRadius + 1);
      graphics.fillTriangle(edgeTipX, edgeTipY, leftBaseX, leftBaseY, edgeLeftX, edgeLeftY);
    }
    
    // Center circle (darker metal)
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(centerX, centerY, 5);
    
    // Center hole
    graphics.fillStyle(0x000000, 0.8);
    graphics.fillCircle(centerX, centerY, 2);
    
    // Metallic ring around hole
    graphics.lineStyle(1, 0x94a3b8, 1);
    graphics.strokeCircle(centerX, centerY, 3.5);
    
    return graphics;
  }

  /**
   * Get the distance from player center this weapon should be positioned
   * @returns {number} Distance in pixels
   */
  static getDistance() {
    return 35; // Close to player for throwing weapon
  }
}
