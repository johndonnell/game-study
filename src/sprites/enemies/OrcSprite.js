/**
 * OrcSprite
 * Handles sprite creation and animation for Orc enemies
 */
export default class OrcSprite {
  static create(scene, container) {
    const parts = {};
    
    // Legs
    parts.leftLeg = scene.add.graphics();
    parts.leftLeg.fillStyle(0x654321, 1);
    parts.leftLeg.fillRect(-8, 10, 7, 12);
    
    parts.rightLeg = scene.add.graphics();
    parts.rightLeg.fillStyle(0x654321, 1);
    parts.rightLeg.fillRect(1, 10, 7, 12);
    
    // Body
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0xcc6600, 1);
    parts.body.fillRect(-12, -6, 24, 16);
    
    // Armor
    parts.armor = scene.add.graphics();
    parts.armor.fillStyle(0x4a4a4a, 1);
    parts.armor.fillRect(-10, -4, 20, 10);
    parts.armor.fillStyle(0x808080, 1);
    parts.armor.fillCircle(-6, 0, 1.5);
    parts.armor.fillCircle(6, 0, 1.5);
    
    // Arms
    parts.leftArm = scene.add.graphics();
    parts.leftArm.fillStyle(0xcc6600, 1);
    parts.leftArm.fillRect(-16, -2, 6, 10);
    parts.leftArm.fillCircle(-13, 10, 3);
    
    parts.rightArm = scene.add.graphics();
    parts.rightArm.fillStyle(0xcc6600, 1);
    parts.rightArm.fillRect(10, -2, 6, 10);
    parts.rightArm.fillCircle(13, 10, 3);
    
    // Neck
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0xcc6600, 1);
    parts.neck.fillRect(-4, -8, 8, 4);
    
    // Head
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0xcc6600, 1);
    parts.head.fillRect(-8, -18, 16, 12);
    parts.head.fillRect(-8, -19, 16, 2);
    
    // Tusks
    parts.tusks = scene.add.graphics();
    parts.tusks.fillStyle(0xfff8dc, 1);
    parts.tusks.fillTriangle(-6, -8, -4, -8, -5, -4);
    parts.tusks.fillTriangle(6, -8, 4, -8, 5, -4);
    
    // Eyes
    parts.eyes = scene.add.graphics();
    parts.eyes.fillStyle(0xffff00, 1);
    parts.eyes.fillRect(-6, -14, 3, 3);
    parts.eyes.fillRect(3, -14, 3, 3);
    parts.eyes.fillStyle(0xff0000, 1);
    parts.eyes.fillRect(-5, -13, 1, 2);
    parts.eyes.fillRect(4, -13, 1, 2);
    
    // Eyebrows
    parts.eyebrows = scene.add.graphics();
    parts.eyebrows.fillStyle(0x4a2511, 1);
    parts.eyebrows.fillRect(-7, -15, 4, 1);
    parts.eyebrows.fillRect(3, -15, 4, 1);
    
    // Nose
    parts.nose = scene.add.graphics();
    parts.nose.fillStyle(0xb35900, 1);
    parts.nose.fillRect(-2, -11, 4, 3);
    
    // Mouth
    parts.mouth = scene.add.graphics();
    parts.mouth.fillStyle(0x4a2511, 1);
    parts.mouth.fillRect(-4, -8, 8, 2);
    
    // Shoulder spikes
    parts.shoulderSpikes = scene.add.graphics();
    parts.shoulderSpikes.fillStyle(0x808080, 1);
    parts.shoulderSpikes.fillTriangle(-14, -6, -12, -10, -10, -6);
    parts.shoulderSpikes.fillTriangle(14, -6, 12, -10, 10, -6);
    
    // Add to container
    container.add(parts.leftLeg);
    container.add(parts.rightLeg);
    container.add(parts.leftArm);
    container.add(parts.body);
    container.add(parts.armor);
    container.add(parts.rightArm);
    container.add(parts.shoulderSpikes);
    container.add(parts.neck);
    container.add(parts.head);
    container.add(parts.tusks);
    container.add(parts.eyebrows);
    container.add(parts.eyes);
    container.add(parts.nose);
    container.add(parts.mouth);
    
    return parts;
  }

  static updateAnimation(parts, animationTime) {
    const stompAmount = Math.sin(animationTime * 0.012) * 1.5;
    
    parts.body.y = -6 + Math.abs(stompAmount);
    parts.armor.y = -4 + Math.abs(stompAmount);
    parts.neck.y = Math.abs(stompAmount);
    parts.head.y = Math.abs(stompAmount);
    parts.tusks.y = Math.abs(stompAmount);
    parts.eyes.y = Math.abs(stompAmount);
    parts.eyebrows.y = Math.abs(stompAmount);
    parts.nose.y = Math.abs(stompAmount);
    parts.mouth.y = Math.abs(stompAmount);
    parts.shoulderSpikes.y = Math.abs(stompAmount);
    
    const legSwing = Math.sin(animationTime * 0.012) * 5;
    parts.leftLeg.y = 10 + Math.abs(stompAmount) + Math.abs(legSwing);
    parts.leftLeg.rotation = legSwing * 0.08;
    parts.rightLeg.y = 10 + Math.abs(stompAmount) + Math.abs(-legSwing);
    parts.rightLeg.rotation = -legSwing * 0.08;
    
    const armSwing = Math.sin(animationTime * 0.012) * 4;
    parts.leftArm.y = -2 + Math.abs(stompAmount) - armSwing;
    parts.leftArm.rotation = -armSwing * 0.1;
    parts.rightArm.y = -2 + Math.abs(stompAmount) + armSwing;
    parts.rightArm.rotation = armSwing * 0.1;
  }
}
