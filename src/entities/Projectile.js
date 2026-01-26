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
   * @param {string} enemyType - Type of enemy firing (for enemy projectiles)
   */
  constructor(scene, x, y, targetX, targetY, damage, speed = 300, weaponType = null, enemyType = null) {
    super(scene);
    
    this.scene = scene;
    this.damage = damage;
    this.speed = speed;
    this.hasHit = false;
    this.weaponType = weaponType;
    this.enemyType = enemyType;
    this.rotationSpeed = 0; // For spinning projectiles
    
    // Set position
    this.x = x;
    this.y = y;
    
    // Calculate direction
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    this.velocityX = (dx / distance) * speed;
    this.velocityY = (dy / distance) * speed;
    
    // Set initial rotation for arrows/spears to face direction of travel
    if (weaponType === 'BOW' || weaponType === 'CROSSBOW' || enemyType === 'GOBLIN') {
      this.rotation = Math.atan2(dy, dx);
    }
    
    // Draw projectile based on weapon type or enemy type
    this.drawProjectile(weaponType, enemyType);
    
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
   * Draw projectile visual based on weapon type or enemy type
   * @param {string} weaponType - Type of weapon
   * @param {string} enemyType - Type of enemy (for enemy projectiles)
   */
  drawProjectile(weaponType, enemyType = null) {
    this.clear();
    
    // Enemy projectiles
    if (enemyType === 'GOBLIN') {
      this.drawSpear();
      return;
    } else if (enemyType === 'DRAGON') {
      this.drawFireball();
      return;
    }
    
    // Player weapon projectiles
    if (weaponType === 'BOW' || weaponType === 'CROSSBOW') {
      this.drawArrow();
    } else if (weaponType === 'WAND' || weaponType === 'STAFF') {
      this.drawFireball();
    } else if (weaponType === 'SHURIKEN') {
      this.drawShuriken();
    } else {
      // Default projectile (yellow circle)
      this.fillStyle(0xffff00, 1);
      this.fillCircle(0, 0, 3);
    }
  }
  
  /**
   * Draw arrow projectile
   */
  drawArrow() {
    // Arrow - wooden shaft with metal tip and feather fletching
    // Arrow points to the right (will be rotated to face direction)
    
    // Arrow shaft (brown wood)
    this.fillStyle(0x8b4513, 1);
    this.fillRect(-8, -1, 16, 2);
    
    // Arrow tip (silver/grey metal - pointed)
    this.fillStyle(0x9ca3af, 1);
    this.fillTriangle(8, -2, 8, 2, 14, 0);
    
    // Arrow tip shine (lighter)
    this.fillStyle(0xd1d5db, 1);
    this.fillTriangle(8, -1, 8, 1, 12, 0);
    
    // Fletching (feathers at back - red/white)
    this.fillStyle(0xff0000, 0.8);
    this.fillTriangle(-8, 0, -12, -3, -10, 0);
    this.fillTriangle(-8, 0, -12, 3, -10, 0);
    
    this.fillStyle(0xffffff, 0.6);
    this.fillTriangle(-8, 0, -11, -2, -10, 0);
    this.fillTriangle(-8, 0, -11, 2, -10, 0);
    
    // Nock (back of arrow - small notch)
    this.fillStyle(0x654321, 1);
    this.fillRect(-12, -1, 2, 2);
  }
  
  /**
   * Draw spear projectile (goblin weapon)
   */
  drawSpear() {
    // Spear - longer and thicker than arrow, crude goblin craftsmanship
    // Spear points to the right (will be rotated to face direction)
    
    // Spear shaft (darker wood, thicker)
    this.fillStyle(0x654321, 1);
    this.fillRect(-12, -2, 24, 4);
    
    // Leather grip in middle
    this.fillStyle(0x3e2723, 1);
    this.fillRect(-2, -2, 6, 4);
    
    // Spear tip (crude iron - darker metal)
    this.fillStyle(0x5a5a5a, 1);
    this.fillTriangle(12, -3, 12, 3, 20, 0);
    
    // Spear tip edge (lighter grey)
    this.fillStyle(0x808080, 1);
    this.fillTriangle(12, -2, 12, 2, 18, 0);
    
    // Binding at spear tip (leather straps)
    this.fillStyle(0x3e2723, 1);
    this.fillRect(10, -2, 3, 1);
    this.fillRect(10, 1, 3, 1);
    
    // Back end (blunt)
    this.fillStyle(0x4a3728, 1);
    this.fillRect(-14, -2, 2, 4);
  }
  
  /**
   * Draw fireball projectile
   */
  drawFireball() {
    // Fireball - orange/red gradient effect
    this.fillStyle(0xff4500, 1);
    this.fillCircle(0, 0, 6);
    this.fillStyle(0xff8c00, 0.8);
    this.fillCircle(0, 0, 4);
    this.fillStyle(0xffff00, 0.6);
    this.fillCircle(0, 0, 2);
  }
  
  /**
   * Draw shuriken projectile
   */
  drawShuriken() {
    // Shuriken - 4-pointed spinning star - MUCH LARGER
    this.rotationSpeed = 0.15; // Fast spin
    
    const outerRadius = 10; // Increased from 6
    const innerRadius = 4;  // Increased from 2
    
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
      this.fillStyle(0x4a5568, 1);
      this.fillTriangle(tipX, tipY, leftBaseX, leftBaseY, rightBaseX, rightBaseY);
      
      // Blade edge highlight (lighter grey)
      this.fillStyle(0x94a3b8, 1);
      const edgeTipX = Math.cos(angle) * (outerRadius - 1.5);
      const edgeTipY = Math.sin(angle) * (outerRadius - 1.5);
      const edgeLeftX = Math.cos(leftAngle) * (innerRadius + 0.5);
      const edgeLeftY = Math.sin(leftAngle) * (innerRadius + 0.5);
      this.fillTriangle(edgeTipX, edgeTipY, leftBaseX, leftBaseY, edgeLeftX, edgeLeftY);
    }
    
    // Center circle (darker metal)
    this.fillStyle(0x1e293b, 1);
    this.fillCircle(0, 0, 3.5);
    
    // Center hole
    this.fillStyle(0x000000, 0.8);
    this.fillCircle(0, 0, 1.5);
    
    // Metallic ring
    this.lineStyle(1, 0x94a3b8, 1);
    this.strokeCircle(0, 0, 2.5);
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
