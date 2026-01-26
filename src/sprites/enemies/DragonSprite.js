export default class DragonSprite {
  static create(scene, container) {
    const parts = {};
    
    parts.tail = scene.add.graphics();
    parts.tail.fillStyle(0x2f2f2f, 1);
    parts.tail.fillEllipse(-20, 0, 8, 12);
    parts.tail.fillEllipse(-26, 2, 7, 10);
    parts.tail.fillEllipse(-31, 4, 6, 8);
    parts.tail.fillEllipse(-35, 5, 5, 6);
    parts.tail.fillEllipse(-38, 6, 4, 5);
    parts.tail.fillTriangle(-38, 6, -42, 6, -40, 8);
    parts.tail.fillStyle(0x1a1a1a, 1);
    parts.tail.fillTriangle(-22, -2, -21, -5, -20, -2);
    parts.tail.fillTriangle(-28, -1, -27, -4, -26, -1);
    parts.tail.fillTriangle(-33, 0, -32, -3, -31, 0);
    
    parts.backLeftLeg = scene.add.graphics();
    parts.backLeftLeg.fillStyle(0x2f2f2f, 1);
    parts.backLeftLeg.fillRect(-8, 4, 6, 10);
    parts.backLeftLeg.fillRect(-7, 14, 5, 8);
    parts.backLeftLeg.fillEllipse(-5, 24, 6, 4);
    parts.backLeftLeg.fillStyle(0x000000, 1);
    parts.backLeftLeg.fillRect(-7, 24, 1, 3);
    parts.backLeftLeg.fillRect(-5, 24, 1, 3);
    parts.backLeftLeg.fillRect(-3, 24, 1, 3);
    
    parts.frontLeftLeg = scene.add.graphics();
    parts.frontLeftLeg.fillStyle(0x2f2f2f, 1);
    parts.frontLeftLeg.fillRect(6, 4, 5, 10);
    parts.frontLeftLeg.fillRect(7, 14, 4, 8);
    parts.frontLeftLeg.fillEllipse(9, 24, 5, 4);
    parts.frontLeftLeg.fillStyle(0x000000, 1);
    parts.frontLeftLeg.fillRect(7, 24, 1, 3);
    parts.frontLeftLeg.fillRect(9, 24, 1, 3);
    parts.frontLeftLeg.fillRect(11, 24, 1, 3);
    
    parts.body = scene.add.graphics();
    parts.body.fillStyle(0x3a3a3a, 1);
    parts.body.fillEllipse(0, 0, 40, 20);
    parts.body.fillStyle(0x505050, 1);
    parts.body.fillEllipse(8, -2, 16, 14);
    parts.body.fillStyle(0x6a6a6a, 1);
    parts.body.fillEllipse(0, 6, 32, 10);
    parts.body.fillStyle(0x2f2f2f, 1);
    for (let i = -14; i <= 14; i += 7) {
      parts.body.fillCircle(i, -6, 2);
    }
    
    parts.leftWing = scene.add.graphics();
    parts.leftWing.fillStyle(0x1a1a1a, 1);
    // Larger wing base
    parts.leftWing.fillEllipse(-4, -8, 12, 8);
    // Larger wing membrane sections
    parts.leftWing.fillTriangle(-4, -8, -14, -28, 0, -14);
    parts.leftWing.fillTriangle(0, -14, -14, -28, -8, -34);
    parts.leftWing.fillTriangle(-8, -34, -14, -28, 0, -36);
    parts.leftWing.fillTriangle(0, -36, -14, -28, 6, -32);
    // Wing bones/structure
    parts.leftWing.lineStyle(2, 0x000000, 1);
    parts.leftWing.lineBetween(-4, -8, -14, -28);
    parts.leftWing.lineBetween(-4, -8, 0, -36);
    parts.leftWing.lineBetween(-4, -8, 6, -32);
    parts.leftWing.lineStyle(3, 0x2f2f2f, 1);
    parts.leftWing.lineBetween(-4, -8, -8, -34);
    
    parts.rightWing = scene.add.graphics();
    parts.rightWing.fillStyle(0x1a1a1a, 1);
    // Larger wing base
    parts.rightWing.fillEllipse(4, -8, 12, 8);
    // Larger wing membrane sections
    parts.rightWing.fillTriangle(4, -8, 18, -28, 0, -14);
    parts.rightWing.fillTriangle(0, -14, 18, -28, 12, -34);
    parts.rightWing.fillTriangle(12, -34, 18, -28, 4, -36);
    parts.rightWing.fillTriangle(4, -36, 18, -28, 0, -32);
    // Wing bones/structure
    parts.rightWing.lineStyle(2, 0x000000, 1);
    parts.rightWing.lineBetween(4, -8, 18, -28);
    parts.rightWing.lineBetween(4, -8, 4, -36);
    parts.rightWing.lineBetween(4, -8, 0, -32);
    parts.rightWing.lineStyle(3, 0x2f2f2f, 1);
    parts.rightWing.lineBetween(4, -8, 12, -34);
    
    parts.backRightLeg = scene.add.graphics();
    parts.backRightLeg.fillStyle(0x3a3a3a, 1);
    parts.backRightLeg.fillEllipse(-10, 8, 8, 12);
    parts.backRightLeg.fillRect(-11, 14, 6, 10);
    parts.backRightLeg.fillEllipse(-8, 26, 8, 5);
    parts.backRightLeg.fillStyle(0x000000, 1);
    parts.backRightLeg.fillRect(-11, 26, 2, 4);
    parts.backRightLeg.fillRect(-8, 26, 2, 4);
    parts.backRightLeg.fillRect(-5, 26, 2, 4);
    
    parts.frontRightLeg = scene.add.graphics();
    parts.frontRightLeg.fillStyle(0x3a3a3a, 1);
    parts.frontRightLeg.fillEllipse(10, 8, 7, 12);
    parts.frontRightLeg.fillRect(9, 14, 5, 10);
    parts.frontRightLeg.fillEllipse(11, 26, 7, 5);
    parts.frontRightLeg.fillStyle(0x000000, 1);
    parts.frontRightLeg.fillRect(8, 26, 2, 4);
    parts.frontRightLeg.fillRect(11, 26, 2, 4);
    parts.frontRightLeg.fillRect(14, 26, 2, 4);
    
    parts.neck = scene.add.graphics();
    parts.neck.fillStyle(0x3a3a3a, 1);
    parts.neck.fillRect(12, -8, 10, 12);
    parts.neck.fillEllipse(17, -2, 10, 10);
    parts.neck.fillStyle(0x2f2f2f, 1);
    parts.neck.fillCircle(14, -4, 1.5);
    parts.neck.fillCircle(17, -5, 1.5);
    parts.neck.fillCircle(20, -4, 1.5);
    
    parts.head = scene.add.graphics();
    parts.head.fillStyle(0x3a3a3a, 1);
    parts.head.fillRect(20, -12, 14, 10);
    parts.head.fillRect(34, -10, 8, 6);
    parts.head.fillRect(42, -9, 4, 4);
    parts.head.fillTriangle(42, -9, 46, -7, 42, -5);
    parts.head.fillRect(34, -4, 8, 3);
    parts.head.fillTriangle(42, -4, 46, -5, 44, -1);
    parts.head.fillStyle(0x2f2f2f, 1);
    parts.head.fillEllipse(32, -6, 6, 8);
    parts.head.fillStyle(0x505050, 1);
    parts.head.fillRect(28, -12, 6, 2);
    parts.head.fillStyle(0x2f2f2f, 1);
    parts.head.fillCircle(24, -8, 1.5);
    parts.head.fillCircle(30, -9, 1.5);
    parts.head.fillCircle(36, -8, 1.5);
    
    parts.horns = scene.add.graphics();
    parts.horns.fillStyle(0x1a1a1a, 1);
    parts.horns.fillTriangle(22, -12, 20, -18, 24, -14);
    parts.horns.fillTriangle(20, -18, 18, -22, 22, -18);
    parts.horns.fillTriangle(18, -22, 17, -24, 20, -22);
    parts.horns.fillTriangle(26, -12, 26, -16, 28, -12);
    parts.horns.fillStyle(0x000000, 1);
    parts.horns.fillRect(19, -20, 1, 2);
    parts.horns.fillRect(18, -23, 1, 1);
    
    parts.eye = scene.add.graphics();
    parts.eye.fillStyle(0xff0000, 1);
    parts.eye.fillCircle(28, -8, 3);
    parts.eye.fillStyle(0xffff00, 1);
    parts.eye.fillCircle(28, -8, 2);
    parts.eye.fillStyle(0x000000, 1);
    parts.eye.fillRect(27.5, -9, 1, 3);
    
    parts.nostril = scene.add.graphics();
    parts.nostril.fillStyle(0x000000, 1);
    parts.nostril.fillCircle(44, -7, 1.5);
    parts.nostril.fillStyle(0x808080, 0.5);
    parts.nostril.fillCircle(46, -8, 2);
    parts.nostril.fillCircle(48, -9, 1.5);
    
    parts.teeth = scene.add.graphics();
    parts.teeth.fillStyle(0xffffff, 1);
    parts.teeth.fillTriangle(40, -9, 40, -5, 38, -7);
    parts.teeth.fillTriangle(36, -10, 36, -6, 34, -8);
    parts.teeth.fillTriangle(38, -4, 38, -1, 36, -3);
    parts.teeth.fillTriangle(42, -9, 42, -7, 41, -8);
    parts.teeth.fillTriangle(44, -9, 44, -7, 43, -8);
    
    parts.backSpikes = scene.add.graphics();
    parts.backSpikes.fillStyle(0x1a1a1a, 1);
    parts.backSpikes.fillTriangle(-12, -8, -10, -14, -8, -8);
    parts.backSpikes.fillTriangle(-4, -8, -2, -15, 0, -8);
    parts.backSpikes.fillTriangle(4, -8, 6, -15, 8, -8);
    parts.backSpikes.fillTriangle(12, -8, 14, -14, 16, -8);
    
    container.add(parts.tail);
    container.add(parts.backLeftLeg);
    container.add(parts.frontLeftLeg);
    container.add(parts.leftWing);
    container.add(parts.body);
    container.add(parts.backSpikes);
    container.add(parts.rightWing);
    container.add(parts.backRightLeg);
    container.add(parts.frontRightLeg);
    container.add(parts.neck);
    container.add(parts.head);
    container.add(parts.horns);
    container.add(parts.eye);
    container.add(parts.nostril);
    container.add(parts.teeth);
    
    return parts;
  }

  static updateAnimation(parts, animationTime) {
    const walkCycle = Math.sin(animationTime * 0.005) * 2;
    parts.body.y = Math.abs(walkCycle) * 0.5;
    parts.backSpikes.y = Math.abs(walkCycle) * 0.5;
    parts.neck.y = Math.abs(walkCycle) * 0.5;
    parts.head.y = Math.abs(walkCycle) * 0.5;
    parts.horns.y = Math.abs(walkCycle) * 0.5;
    parts.eye.y = Math.abs(walkCycle) * 0.5;
    parts.nostril.y = Math.abs(walkCycle) * 0.5;
    parts.teeth.y = Math.abs(walkCycle) * 0.5;
    parts.head.rotation = Math.sin(animationTime * 0.004) * 0.03;
    parts.horns.rotation = Math.sin(animationTime * 0.004) * 0.03;
    parts.eye.rotation = Math.sin(animationTime * 0.004) * 0.03;
    parts.nostril.rotation = Math.sin(animationTime * 0.004) * 0.03;
    parts.teeth.rotation = Math.sin(animationTime * 0.004) * 0.03;
    const wingFlap = Math.sin(animationTime * 0.003) * 0.2;
    parts.leftWing.rotation = wingFlap;
    parts.leftWing.y = Math.abs(walkCycle) * 0.5 - Math.abs(wingFlap) * 2;
    parts.rightWing.rotation = -wingFlap;
    parts.rightWing.y = Math.abs(walkCycle) * 0.5 - Math.abs(wingFlap) * 2;
    const tailSwish = Math.sin(animationTime * 0.006) * 0.3;
    parts.tail.rotation = tailSwish;
    parts.tail.y = Math.abs(walkCycle) * 0.5;
    const legWalk = Math.sin(animationTime * 0.005);
    parts.backRightLeg.y = Math.abs(walkCycle) * 0.5 + (legWalk > 0 ? legWalk * 2 : 0);
    parts.frontLeftLeg.y = Math.abs(walkCycle) * 0.5 + (legWalk > 0 ? legWalk * 2 : 0);
    parts.backLeftLeg.y = Math.abs(walkCycle) * 0.5 + (legWalk < 0 ? -legWalk * 2 : 0);
    parts.frontRightLeg.y = Math.abs(walkCycle) * 0.5 + (legWalk < 0 ? -legWalk * 2 : 0);
    const glowPulse = Math.sin(animationTime * 0.003);
    parts.eye.alpha = 0.85 + glowPulse * 0.15;
    parts.nostril.alpha = 0.6 + Math.sin(animationTime * 0.004) * 0.3;
  }
}
