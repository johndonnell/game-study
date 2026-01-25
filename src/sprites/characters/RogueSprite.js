/**
 * RogueSprite
 * Handles sprite creation and animation for the Rogue character
 */
export default class RogueSprite {
  /**
   * Create rogue sprite parts
   * @param {Phaser.Scene} scene - The scene
   * @param {Phaser.GameObjects.Container} container - Container to add parts to
   * @returns {Object} Object containing all sprite parts
   */
  static create(scene, container) {
    const parts = {};
    
    // Cape (flowing behind - dark grey/black)
    parts.cape = scene.add.graphics();
    parts.cape.fillStyle(0x1f2937, 1); // Dark grey
    // Cape shape - flowing
    parts.cape.fillTriangle(-8, -6, -14, 12, -6, 8);
    parts.cape.fillTriangle(8, -6, 14, 12, 6, 8);
    parts.cape.fillRect(-8, -6, 16, 14);
    // Cape bottom edge (tattered)
    parts.cape.fillStyle(0x111827, 1);
    parts.cape.fillRect(-8, 8, 16, 2);
    
    // Legs (dark pants - black) - EXTENDED TO CONNECT WITH BODY
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x1f2937, 1);
    parts.leftLeg.fillRect(-7, 6, 5, 14); // Start at y=6 instead of y=8
    // Boot
    parts.leftLeg.fillStyle(0x111827, 1);
    parts.leftLeg.fillRect(-7, 18, 5, 4);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x1f2937, 1);
    parts.rightLeg.fillRect(2, 6, 5, 14); // Start at y=6 instead of y=8
    // Boot
    parts.rightLeg.fillStyle(0x111827, 1);
    parts.rightLeg.fillRect(2, 18, 5, 4);
    
    // Body (leather armor - dark brown) - EXTENDED TO COVER FULL TORSO
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0x4b3621, 1); // Dark brown leather
    parts.body.fillRect(-9, -8, 18, 16); // Extended from y=-6 to y=-8
    // Leather straps (darker)
    parts.body.fillStyle(0x2d1f12, 1);
    parts.body.fillRect(-9, -2, 18, 2);
    parts.body.fillRect(-9, 4, 18, 2);
    
    // Belt with pouches (brown) - OVERLAPS WITH BODY AND LEGS
    parts.belt = scene.add.graphics();
    parts.belt.fillStyle(0x654321, 1);
    parts.belt.fillRect(-9, 6, 18, 4); // Extended height from 3 to 4
    // Belt buckle (silver)
    parts.belt.fillStyle(0x9ca3af, 1);
    parts.belt.fillRect(-2, 6, 4, 4);
    // Pouches
    parts.belt.fillStyle(0x4b3621, 1);
    parts.belt.fillRect(-8, 9, 4, 3);
    parts.belt.fillRect(4, 9, 4, 3);
    
    // Arms (leather armor) - EXTENDED TO CONNECT WITH SHOULDERS
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0x4b3621, 1);
    parts.leftArm.fillRect(-13, -4, 5, 12); // Extended from y=-2 to y=-4
    // Arm guard (darker)
    parts.leftArm.fillStyle(0x2d1f12, 1);
    parts.leftArm.fillRect(-13, -4, 5, 3);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0x4b3621, 1);
    parts.rightArm.fillRect(8, -4, 5, 12); // Extended from y=-2 to y=-4
    // Arm guard (darker)
    parts.rightArm.fillStyle(0x2d1f12, 1);
    parts.rightArm.fillRect(8, -4, 5, 3);
    
    // Hands (gloved - black)
    parts.leftHand = scene.add.graphics();
    parts.leftHand.fillStyle(0x1f2937, 1);
    parts.leftHand.fillCircle(-10, 10, 2.5);
    
    parts.rightHand = scene.add.graphics();
    parts.rightHand.fillStyle(0x1f2937, 1);
    parts.rightHand.fillCircle(10, 10, 2.5);
    
    // Dagger (in right hand)
    parts.dagger = scene.add.graphics();
    parts.dagger.fillStyle(0x9ca3af, 1); // Silver blade
    parts.dagger.fillRect(11, 8, 2, 8);
    parts.dagger.fillTriangle(11, 8, 13, 8, 12, 5);
    // Dagger handle (brown)
    parts.dagger.fillStyle(0x654321, 1);
    parts.dagger.fillRect(11, 16, 2, 3);
    
    // Shoulder guards (leather) - POSITIONED TO CONNECT WITH BODY
    parts.shoulders = scene.add.graphics();
    parts.shoulders.fillStyle(0x2d1f12, 1);
    parts.shoulders.fillCircle(-9, -6, 4); // Larger and positioned to overlap
    parts.shoulders.fillCircle(9, -6, 4);
    
    // Neck (connects body to hood) - NEW PART TO FILL GAP
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0x4b3621, 1);
    parts.neck.fillRect(-4, -10, 8, 4); // Fills gap between body and hood
    
    // Hood (dark grey - covering head) - EXTENDED DOWN TO CONNECT WITH BODY
    parts.hood = scene.add.graphics();
    parts.hood.fillStyle(0x1f2937, 1);
    // Hood shape - pointed top
    parts.hood.fillTriangle(-10, -8, 10, -8, 0, -22);
    // Hood sides - EXTENDED DOWN
    parts.hood.fillRect(-10, -8, 20, 6); // Extended from height 4 to 6
    // Hood shadow (darker)
    parts.hood.fillStyle(0x111827, 1);
    parts.hood.fillRect(-8, -8, 16, 2);
    
    // Face (mostly shadowed - only lower part visible)
    parts.face = scene.add.graphics();
    parts.face.fillStyle(0x0f172a, 0.8); // Very dark shadow
    parts.face.fillRect(-7, -10, 14, 6);
    
    // Eyes (glowing in shadow - mysterious)
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0x10b981, 1); // Green glow
    parts.eyes.fillCircle(-3, -8, 1.5);
    parts.eyes.fillCircle(3, -8, 1.5);
    // Eye glow effect
    parts.eyes.fillStyle(0x34d399, 0.5);
    parts.eyes.fillCircle(-3, -8, 2.5);
    parts.eyes.fillCircle(3, -8, 2.5);
    
    // Mask/Scarf (covering lower face)
    parts.mask = scene.add.graphics();
    parts.mask.fillStyle(0x1f2937, 1);
    parts.mask.fillRect(-6, -6, 12, 4);
    
    // Add all parts to container in correct order (back to front)
    container.add(parts.cape);
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.body);
    container.add(parts.belt);
    container.add(parts.rightArm);
    container.add(parts.leftHand);
    container.add(parts.rightHand);
    container.add(parts.dagger);
    container.add(parts.shoulders);
    container.add(parts.neck);
    container.add(parts.hood);
    container.add(parts.face);
    container.add(parts.mask);
    container.add(parts.eyes);
    
    return parts;
  }

  /**
   * Update rogue animation
   * @param {Object} parts - Sprite parts object
   * @param {number} animationTime - Current animation time
   * @param {boolean} isMoving - Whether character is moving
   */
  static updateAnimation(parts, animationTime, isMoving) {
    if (isMoving) {
      // Stealthy movement - crouched and quick
      const bobAmount = Math.sin(animationTime * 0.015) * 1; // Faster, smaller bob
      
      // Bob the body (less pronounced - stealthy)
      parts.body.y = bobAmount;
      parts.belt.y = bobAmount;
      parts.neck.y = bobAmount;
      parts.hood.y = bobAmount;
      parts.face.y = bobAmount;
      parts.mask.y = bobAmount;
      parts.eyes.y = bobAmount;
      parts.shoulders.y = bobAmount;
      
      // Cape flows dramatically
      const capeFlow = Math.sin(animationTime * 0.012) * 3;
      parts.cape.rotation = capeFlow * 0.08;
      parts.cape.y = bobAmount + Math.abs(capeFlow) * 0.3;
      
      // Quick leg movement
      const legSwing = Math.sin(animationTime * 0.018) * 5;
      parts.leftLeg.y = bobAmount + Math.abs(legSwing);
      parts.leftLeg.rotation = legSwing * 0.06;
      parts.rightLeg.y = bobAmount + Math.abs(-legSwing);
      parts.rightLeg.rotation = -legSwing * 0.06;
      
      // Arms swing (dagger ready)
      const armSwing = Math.sin(animationTime * 0.018) * 2;
      parts.leftArm.y = bobAmount - armSwing;
      parts.leftArm.rotation = -armSwing * 0.05;
      parts.leftHand.y = 10 + bobAmount - armSwing;
      
      parts.rightArm.y = bobAmount + armSwing * 0.5;
      parts.rightArm.rotation = armSwing * 0.03;
      parts.rightHand.y = 10 + bobAmount + armSwing * 0.5;
      parts.dagger.y = bobAmount + armSwing * 0.5;
      
      // Hood sways slightly
      parts.hood.rotation = Math.sin(animationTime * 0.01) * 0.03;
    } else {
      // Idle animation - alert and ready
      const breathAmount = Math.sin(animationTime * 0.004) * 0.3;
      
      parts.body.y = breathAmount;
      parts.belt.y = breathAmount;
      parts.neck.y = breathAmount;
      parts.hood.y = breathAmount;
      parts.face.y = breathAmount;
      parts.mask.y = breathAmount;
      parts.eyes.y = breathAmount;
      parts.shoulders.y = breathAmount;
      
      // Cape sways gently
      const capeSwayAmount = Math.sin(animationTime * 0.003) * 1;
      parts.cape.rotation = capeSwayAmount * 0.02;
      parts.cape.y = breathAmount;
      
      // Legs in ready stance
      parts.leftLeg.y = 0;
      parts.leftLeg.rotation = 0;
      parts.rightLeg.y = 0;
      parts.rightLeg.rotation = 0;
      
      // Arms ready (dagger at the ready)
      const readyAmount = Math.sin(animationTime * 0.005) * 0.5;
      parts.leftArm.y = breathAmount;
      parts.leftArm.rotation = 0;
      parts.leftHand.y = 10 + breathAmount;
      
      parts.rightArm.y = breathAmount + readyAmount;
      parts.rightArm.rotation = readyAmount * 0.02;
      parts.rightHand.y = 10 + breathAmount + readyAmount;
      parts.dagger.y = breathAmount + readyAmount;
      
      // Hood stays mostly still
      parts.hood.rotation = 0;
      
      // Eyes glow pulses
      const glowPulse = Math.sin(animationTime * 0.006);
      parts.eyes.alpha = 0.9 + glowPulse * 0.1;
    }
  }
}
