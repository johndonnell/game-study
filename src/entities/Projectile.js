import Phaser from 'phaser';

/**
 * Projectile class
 * Represents a projectile fired from a ranged weapon
 */
export default class Projectile extends Phaser.GameObjects.Graphics {
  /**
   * @param {Phaser.Scene} scene - The scene this projectile belongs to
   * @param {number} x - Starting x position
   * @param {number} y - Starting y position
   * @param {number} targetX - Target x position
   * @param {number} targetY - Target y position
   * @param {number} damage - Damage this projectile deals
   * @param {number} speed - Speed of projectile
   * @param {string} weaponType - Type of weapon firing (for visual style)
   */
  constructor(scene, x, y, targetX, targetY, damage, speed = 300, weaponType = null) {
    super(scene);
    
    this.scene = scene;
    this.damage = damage;
    this.speed = speed;
    this.hasHit = false;
    this.weaponType = weaponType;
    this.rotationSpeed = 0; // For spinning projectiles
    
    // Set position
    this.x = x;
    this.y = y;
    
    // Draw projectile based on weapon type
    this.drawProjectile(weaponType);
    
    // Calculate direction
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.velocityX = (dx / distance) * speed;
    this.velocityY = (dy / distance) * speed;
    
    // Add to scene
    scene.add.existing(this);
    
    // Auto-destroy after 2 seconds
    scene.time.delayedCall(2000, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }
  
  /**
   * Draw projectile visual based on weapon type
   * @param {string} weaponType - Type of weapon
   */
  drawProjectile(weaponType) {
    this.clear();
    
    if (weaponType === 'WAND' || weaponType === 'STAFF') {
      // Fireball - orange/red gradient effect
      this.fillStyle(0xff4500, 1);
      this.fillCircle(0, 0, 6);
      this.fillStyle(0xff8c00, 0.8);
      this.fillCircle(0, 0, 4);
      this.fillStyle(0xffff00, 0.6);
      this.fillCircle(0, 0, 2);
    } else if (weaponType === 'SHURIKEN') {
      // Shuriken - 4-pointed spinning star
      this.rotationSpeed = 0.15; // Fast spin
      
      const outerRadius = 6;
      const innerRadius = 2;
      
      // Main body (dark grey metal)
      this.fillStyle(0x4a5568, 1);
      
      // Draw 4-pointed star shape
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) - Math.PI / 4;
        const nextAngle = ((i + 1) * Math.PI / 2) - Math.PI / 4;
        
        // Outer point
        const outerX = Math.cos(angle) * outerRadius;
        const outerY = Math.sin(angle) * outerRadius;
        
        // Inner points
        const innerAngle1 = angle + Math.PI / 4;
        const innerX1 = Math.cos(innerAngle1) * innerRadius;
        const innerY1 = Math.sin(innerAngle1) * innerRadius;
        
        const innerAngle2 = nextAngle - Math.PI / 4;
        const innerX2 = Math.cos(innerAngle2) * innerRadius;
        const innerY2 = Math.sin(innerAngle2) * innerRadius;
        
        // Draw triangle for this blade
        this.fillTriangle(outerX, outerY, innerX1, innerY1, innerX2, innerY2);
      }
      
      // Center circle
      this.fillStyle(0x1e293b, 1);
      this.fillCircle(0, 0, 2);
      
      // Metallic highlights
      this.fillStyle(0x94a3b8, 1);
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) - Math.PI / 4;
        const highlightX = Math.cos(angle) * (outerRadius - 0.5);
        const highlightY = Math.sin(angle) * (outerRadius - 0.5);
        this.fillCircle(highlightX, highlightY, 0.6);
      }
    } else {
      // Default projectile (yellow circle)
      this.fillStyle(0xffff00, 1);
      this.fillCircle(0, 0, 3);
    }
  }
  
  /**
   * Update projectile position
   * @param {number} delta - Time since last update in milliseconds
   */
  update(delta) {
    if (this.hasHit) {
      return;
    }
    
    // Move projectile
    const deltaSeconds = delta / 1000;
    this.x += this.velocityX * deltaSeconds;
    this.y += this.velocityY * deltaSeconds;
    
    // Rotate spinning projectiles (like shuriken)
    if (this.rotationSpeed > 0) {
      this.rotation += this.rotationSpeed;
    }
    
    // Check if out of bounds
    const bounds = this.scene.sys.game.config;
    if (this.x < 0 || this.x > bounds.width || this.y < 0 || this.y > bounds.height) {
      this.destroy();
    }
  }
  
  /**
   * Mark projectile as having hit a target
   */
  hit() {
    this.hasHit = true;
    this.destroy();
  }
}
