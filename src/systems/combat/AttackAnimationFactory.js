/**
 * AttackAnimationFactory
 * Creates weapon-specific attack animations
 */
export default class AttackAnimationFactory {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Create melee attack effect based on weapon type
   * @param {PlayerCharacter} player - Player character
   * @param {Enemy} enemy - Target enemy
   * @param {Weapon} weapon - Weapon being used
   * @param {number} effectiveRange - Effective weapon range after modifiers
   */
  createMeleeAttackEffect(player, enemy, weapon, effectiveRange) {
    // Calculate angle from player to enemy
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const angle = Math.atan2(dy, dx);
    
    // Use weapon's effective range for animation size
    const range = effectiveRange;
    
    // Different animations based on weapon type
    const weaponType = weapon.type;
    
    // Sword-like weapons: slash arc
    if (['SWORD', 'KATANA', 'RAPIER', 'GREATSWORD'].includes(weaponType)) {
      this.createSlashArc(player, angle, 0xffffff, range);
    }
    // Axe/Hammer: overhead swing
    else if (['AXE', 'HAMMER', 'MACE'].includes(weaponType)) {
      this.createOverheadSwing(player, angle, 0xff8800, range);
    }
    // Dagger: quick stab
    else if (['DAGGER'].includes(weaponType)) {
      this.createStab(player, angle, 0xcccccc, range);
    }
    // Spear/Lance: thrust
    else if (['SPEAR', 'LANCE'].includes(weaponType)) {
      this.createThrust(player, angle, 0xffff00, range);
    }
    // Whip/Flail: sweeping motion
    else if (['WHIP', 'FLAIL', 'SCYTHE'].includes(weaponType)) {
      this.createSweep(player, angle, 0xff00ff, range);
    }
    // Gauntlets: punch
    else if (['GAUNTLETS'].includes(weaponType)) {
      this.createPunch(player, angle, 0xff0000, range);
    }
    // Default: simple slash
    else {
      this.createSlashArc(player, angle, 0xffffff, range);
    }
  }

  /**
   * Create slash arc animation (swords)
   * Left-to-right curved slash with motion blur
   */
  createSlashArc(player, angle, color, range) {
    // Create multiple slash trails for motion blur effect
    const slashCount = 3;
    
    for (let i = 0; i < slashCount; i++) {
      const delay = i * 15; // Stagger each trail
      const alpha = 1 - (i * 0.25); // Fade each subsequent trail
      
      this.scene.time.delayedCall(delay, () => {
        const slash = this.scene.add.graphics();
        
        // Calculate left-to-right curved slash path
        // Start from upper-left relative to attack direction
        const startAngle = angle - Math.PI / 2.5; // ~72 degrees left
        const endAngle = angle + Math.PI / 2.5; // ~72 degrees right
        
        // Create curved slash using quadratic bezier curve
        const startX = player.x + Math.cos(startAngle) * range * 0.7;
        const startY = player.y + Math.sin(startAngle) * range * 0.7;
        
        const endX = player.x + Math.cos(endAngle) * range * 0.7;
        const endY = player.y + Math.sin(endAngle) * range * 0.7;
        
        // Control point for curve (extends outward from player)
        const controlX = player.x + Math.cos(angle) * range;
        const controlY = player.y + Math.sin(angle) * range;
        
        // Draw main slash trail
        slash.lineStyle(5 - i, color, alpha);
        slash.beginPath();
        slash.moveTo(startX, startY);
        
        // Create smooth curve using multiple points
        const segments = 20;
        for (let t = 0; t <= segments; t++) {
          const progress = t / segments;
          // Quadratic bezier formula
          const x = Math.pow(1 - progress, 2) * startX + 
                    2 * (1 - progress) * progress * controlX + 
                    Math.pow(progress, 2) * endX;
          const y = Math.pow(1 - progress, 2) * startY + 
                    2 * (1 - progress) * progress * controlY + 
                    Math.pow(progress, 2) * endY;
          slash.lineTo(x, y);
        }
        slash.strokePath();
        
        // Add inner trail for depth
        if (i === 0) {
          slash.lineStyle(3, 0xffffff, alpha * 0.6);
          slash.beginPath();
          slash.moveTo(startX, startY);
          
          for (let t = 0; t <= segments; t++) {
            const progress = t / segments;
            const x = Math.pow(1 - progress, 2) * startX + 
                      2 * (1 - progress) * progress * (player.x + Math.cos(angle) * range * 0.85) + 
                      Math.pow(progress, 2) * endX;
            const y = Math.pow(1 - progress, 2) * startY + 
                      2 * (1 - progress) * progress * (player.y + Math.sin(angle) * range * 0.85) + 
                      Math.pow(progress, 2) * endY;
            slash.lineTo(x, y);
          }
          slash.strokePath();
        }
        
        // Animate the slash with fade
        this.scene.tweens.add({
          targets: slash,
          alpha: 0,
          duration: 180 - (i * 20),
          ease: 'Power2',
          onComplete: () => slash.destroy()
        });
      });
    }
    
    // Add impact sparkles along the slash path
    const sparkleCount = 5;
    for (let i = 0; i < sparkleCount; i++) {
      const progress = (i + 1) / (sparkleCount + 1);
      const startAngle = angle - Math.PI / 2.5;
      const endAngle = angle + Math.PI / 2.5;
      
      const startX = player.x + Math.cos(startAngle) * range * 0.7;
      const startY = player.y + Math.sin(startAngle) * range * 0.7;
      const endX = player.x + Math.cos(endAngle) * range * 0.7;
      const endY = player.y + Math.sin(endAngle) * range * 0.7;
      const controlX = player.x + Math.cos(angle) * range;
      const controlY = player.y + Math.sin(angle) * range;
      
      // Calculate position along curve
      const sparkleX = Math.pow(1 - progress, 2) * startX + 
                       2 * (1 - progress) * progress * controlX + 
                       Math.pow(progress, 2) * endX;
      const sparkleY = Math.pow(1 - progress, 2) * startY + 
                       2 * (1 - progress) * progress * controlY + 
                       Math.pow(progress, 2) * endY;
      
      this.scene.time.delayedCall(30 + i * 15, () => {
        const sparkle = this.scene.add.graphics();
        sparkle.fillStyle(0xffffff, 1);
        sparkle.fillCircle(sparkleX, sparkleY, 3);
        
        const sparkleAngle = Math.random() * Math.PI * 2;
        const sparkleDistance = 8 + Math.random() * 12;
        
        this.scene.tweens.add({
          targets: sparkle,
          x: sparkleX + Math.cos(sparkleAngle) * sparkleDistance,
          y: sparkleY + Math.sin(sparkleAngle) * sparkleDistance,
          alpha: 0,
          scale: 0.2,
          duration: 120 + Math.random() * 80,
          ease: 'Power2',
          onComplete: () => sparkle.destroy()
        });
      });
    }
  }

  /**
   * Create overhead swing animation (axes, hammers)
   */
  createOverheadSwing(player, angle, color, range) {
    const swing = this.scene.add.graphics();
    swing.lineStyle(5, color, 1);
    
    const startX = player.x + Math.cos(angle - Math.PI / 3) * (range * 0.6);
    const startY = player.y + Math.sin(angle - Math.PI / 3) * (range * 0.6);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    swing.beginPath();
    swing.moveTo(startX, startY);
    swing.lineTo(endX, endY);
    swing.strokePath();
    
    this.scene.tweens.add({
      targets: swing,
      alpha: 0,
      duration: 180,
      onComplete: () => swing.destroy()
    });
  }

  /**
   * Create stab animation (daggers)
   */
  createStab(player, angle, color, range) {
    const stab = this.scene.add.graphics();
    stab.lineStyle(2, color, 1);
    
    const startX = player.x + Math.cos(angle) * (range * 0.3);
    const startY = player.y + Math.sin(angle) * (range * 0.3);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    stab.beginPath();
    stab.moveTo(startX, startY);
    stab.lineTo(endX, endY);
    stab.strokePath();
    
    this.scene.tweens.add({
      targets: stab,
      alpha: 0,
      x: stab.x + Math.cos(angle) * (range * 0.3),
      y: stab.y + Math.sin(angle) * (range * 0.3),
      duration: 120,
      onComplete: () => stab.destroy()
    });
  }

  /**
   * Create thrust animation (spears, lances)
   */
  createThrust(player, angle, color, range) {
    const thrust = this.scene.add.graphics();
    thrust.lineStyle(3, color, 1);
    
    const startX = player.x + Math.cos(angle) * (range * 0.4);
    const startY = player.y + Math.sin(angle) * (range * 0.4);
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    thrust.beginPath();
    thrust.moveTo(startX, startY);
    thrust.lineTo(endX, endY);
    thrust.strokePath();
    
    this.scene.tweens.add({
      targets: thrust,
      alpha: 0,
      x: thrust.x + Math.cos(angle) * (range * 0.4),
      y: thrust.y + Math.sin(angle) * (range * 0.4),
      duration: 150,
      onComplete: () => thrust.destroy()
    });
  }

  /**
   * Create sweep animation (whips, flails)
   */
  createSweep(player, angle, color, range) {
    const sweep = this.scene.add.graphics();
    sweep.lineStyle(2, color, 1);
    
    // Wide sweeping arc using weapon range
    const startAngle = angle - Math.PI / 3;
    const endAngle = angle + Math.PI / 3;
    
    sweep.beginPath();
    sweep.arc(player.x, player.y, range, startAngle, endAngle);
    sweep.strokePath();
    
    this.scene.tweens.add({
      targets: sweep,
      alpha: 0,
      duration: 250,
      onComplete: () => sweep.destroy()
    });
  }

  /**
   * Create punch animation (gauntlets)
   */
  createPunch(player, angle, color, range) {
    const punch = this.scene.add.graphics();
    punch.fillStyle(color, 1);
    
    const x = player.x + Math.cos(angle) * range;
    const y = player.y + Math.sin(angle) * range;
    
    punch.fillCircle(x, y, 8);
    
    this.scene.tweens.add({
      targets: punch,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 150,
      onComplete: () => punch.destroy()
    });
  }
}
