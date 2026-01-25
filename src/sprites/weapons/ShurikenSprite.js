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
    
    // Shuriken is a 4-pointed throwing star
    const centerX = 0;
    const centerY = 0;
    const outerRadius = 8;
    const innerRadius = 3;
    
    // Main body (dark grey metal)
    graphics.fillStyle(0x4a5568, 1);
    
    // Draw 4-pointed star shape
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2) - Math.PI / 4; // 45-degree offset for diagonal points
      const nextAngle = ((i + 1) * Math.PI / 2) - Math.PI / 4;
      
      // Outer point
      const outerX = centerX + Math.cos(angle) * outerRadius;
      const outerY = centerY + Math.sin(angle) * outerRadius;
      
      // Inner points (between outer points)
      const innerAngle1 = angle + Math.PI / 4;
      const innerX1 = centerX + Math.cos(innerAngle1) * innerRadius;
      const innerY1 = centerY + Math.sin(innerAngle1) * innerRadius;
      
      const innerAngle2 = nextAngle - Math.PI / 4;
      const innerX2 = centerX + Math.cos(innerAngle2) * innerRadius;
      const innerY2 = centerY + Math.sin(innerAngle2) * innerRadius;
      
      // Draw triangle for this blade
      graphics.fillTriangle(outerX, outerY, innerX1, innerY1, innerX2, innerY2);
    }
    
    // Center circle (darker metal)
    graphics.fillStyle(0x1e293b, 1);
    graphics.fillCircle(centerX, centerY, 2.5);
    
    // Center hole
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillCircle(centerX, centerY, 1);
    
    // Add metallic highlights on blade tips
    graphics.fillStyle(0x94a3b8, 1);
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI / 2) - Math.PI / 4;
      const highlightX = centerX + Math.cos(angle) * (outerRadius - 1);
      const highlightY = centerY + Math.sin(angle) * (outerRadius - 1);
      graphics.fillCircle(highlightX, highlightY, 0.8);
    }
    
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
