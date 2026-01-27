/**
 * AttackAnimationFactory
 * Creates weapon-specific attack animations
 */
import SwordSprite from '../../sprites/weapons/SwordSprite.js';
import SpearSprite from '../../sprites/weapons/SpearSprite.js';
import KatanaSprite from '../../sprites/weapons/KatanaSprite.js';
import RapierSprite from '../../sprites/weapons/RapierSprite.js';
import GreatswordSprite from '../../sprites/weapons/GreatswordSprite.js';
import AxeSprite from '../../sprites/weapons/AxeSprite.js';
import HammerSprite from '../../sprites/weapons/HammerSprite.js';
import MaceSprite from '../../sprites/weapons/MaceSprite.js';
import DaggerSprite from '../../sprites/weapons/DaggerSprite.js';
import LanceSprite from '../../sprites/weapons/LanceSprite.js';
import WhipSprite from '../../sprites/weapons/WhipSprite.js';
import FlailSprite from '../../sprites/weapons/FlailSprite.js';
import ScytheSprite from '../../sprites/weapons/ScytheSprite.js';
import GauntletsSprite from '../../sprites/weapons/GauntletsSprite.js';

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
   * @param {Object} weaponSprite - The circling weapon sprite to hide during attack
   */
  createMeleeAttackEffect(player, enemy, weapon, effectiveRange, weaponSprite = null) {
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
      this.createSlashArc(player, angle, range, weaponSprite, weaponType);
    }
    // Axe/Hammer: overhead swing
    else if (['AXE', 'HAMMER', 'MACE'].includes(weaponType)) {
      this.createOverheadSwing(player, angle, range, weaponSprite, weaponType);
    }
    // Dagger: quick stab
    else if (['DAGGER'].includes(weaponType)) {
      this.createStab(player, angle, range, weaponSprite);
    }
    // Spear/Lance: thrust
    else if (['SPEAR', 'LANCE'].includes(weaponType)) {
      this.createThrust(player, angle, range, weaponSprite, weaponType);
    }
    // Whip/Flail: sweeping motion
    else if (['WHIP', 'FLAIL', 'SCYTHE'].includes(weaponType)) {
      this.createSweep(player, angle, range, weaponSprite, weaponType);
    }
    // Gauntlets: punch
    else if (['GAUNTLETS'].includes(weaponType)) {
      this.createPunch(player, angle, range, weaponSprite);
    }
    // Default: simple slash
    else {
      this.createSlashArc(player, angle, range, weaponSprite, 'SWORD');
    }
  }

  /**
   * Create slash arc animation (swords)
   * Animated sweeping arc using actual sword sprite with tween optimization
   */
  createSlashArc(player, angle, range, weaponSprite = null, weaponType = 'SWORD') {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create appropriate sword sprite based on weapon type
    let weaponGraphic;
    switch(weaponType) {
      case 'KATANA':
        weaponGraphic = KatanaSprite.create(this.scene);
        break;
      case 'RAPIER':
        weaponGraphic = RapierSprite.create(this.scene);
        break;
      case 'GREATSWORD':
        weaponGraphic = GreatswordSprite.create(this.scene);
        break;
      default:
        weaponGraphic = SwordSprite.create(this.scene);
    }
    
    // Make weapon larger and more visible
    weaponGraphic.setScale(2.0);
    
    // Calculate start and end positions
    const startOffset = -Math.PI / 2;
    const endOffset = Math.PI / 2;
    const distance = range * 0.7;
    
    const startAngle = angle + startOffset;
    const endAngle = angle + endOffset;
    
    const startX = player.x + Math.cos(startAngle) * distance;
    const startY = player.y + Math.sin(startAngle) * distance;
    const endX = player.x + Math.cos(endAngle) * distance;
    const endY = player.y + Math.sin(endAngle) * distance;
    
    // Position at start
    weaponGraphic.x = startX;
    weaponGraphic.y = startY;
    weaponGraphic.rotation = startAngle + Math.PI / 2;
    
    // Animate with tween
    this.scene.tweens.add({
      targets: weaponGraphic,
      x: endX,
      y: endY,
      rotation: endAngle + Math.PI / 2,
      alpha: { from: 1, to: 0, duration: 200, delay: 140 }, // Fade in last 30%
      duration: 200, // ~12 frames at 60fps
      ease: 'Linear',
      onComplete: () => {
        weaponGraphic.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }

  /**
   * Create overhead swing animation (axes, hammers)
   * Animated arc that swings from above to the target using actual weapon sprite with tween optimization
   */
  createOverheadSwing(player, angle, range, weaponSprite = null, weaponType = 'AXE') {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create appropriate weapon sprite based on weapon type
    let weaponGraphic;
    switch(weaponType) {
      case 'HAMMER':
        weaponGraphic = HammerSprite.create(this.scene);
        break;
      case 'MACE':
        weaponGraphic = MaceSprite.create(this.scene);
        break;
      default:
        weaponGraphic = AxeSprite.create(this.scene);
    }
    
    // Make weapon larger and more visible
    weaponGraphic.setScale(2.0);
    
    // Calculate start and end positions
    const distance = range * 0.7;
    const startAngle = angle - Math.PI / 2;
    const endAngle = angle;
    
    const startX = player.x + Math.cos(startAngle) * distance;
    const startY = player.y + Math.sin(startAngle) * distance;
    const endX = player.x + Math.cos(endAngle) * distance;
    const endY = player.y + Math.sin(endAngle) * distance;
    
    // Position at start
    weaponGraphic.x = startX;
    weaponGraphic.y = startY;
    weaponGraphic.rotation = startAngle + Math.PI / 2;
    
    // Animate with tween
    this.scene.tweens.add({
      targets: weaponGraphic,
      x: endX,
      y: endY,
      rotation: endAngle + Math.PI / 2,
      alpha: { from: 1, to: 0, duration: 200, delay: 140 },
      duration: 200,
      ease: 'Quad.easeIn', // Accelerate downward
      onComplete: () => {
        weaponGraphic.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }

  /**
   * Create stab animation (daggers)
   * Quick thrust forward using actual dagger sprite with tween optimization
   */
  createStab(player, angle, range, weaponSprite = null) {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create dagger sprite for attack animation
    const dagger = DaggerSprite.create(this.scene);
    
    // Make dagger larger and more visible
    dagger.setScale(2.0);
    
    // Position at player location
    dagger.x = player.x;
    dagger.y = player.y;
    dagger.rotation = angle + Math.PI / 2;
    
    // Calculate end position
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    // Animate with tween (faster for quick stab)
    this.scene.tweens.add({
      targets: dagger,
      x: endX,
      y: endY,
      alpha: { from: 1, to: 0, duration: 100, delay: 70 },
      duration: 100, // ~6 frames at 60fps
      ease: 'Quad.easeOut',
      onComplete: () => {
        dagger.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }

  /**
   * Create thrust animation (spears, lances)
   * Extended thrust using actual spear/lance sprite with tween optimization
   */
  createThrust(player, angle, range, weaponSprite = null, weaponType = 'SPEAR') {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create appropriate weapon sprite based on weapon type
    let weaponGraphic;
    if (weaponType === 'LANCE') {
      weaponGraphic = LanceSprite.create(this.scene);
    } else {
      weaponGraphic = SpearSprite.create(this.scene);
    }
    
    // Make weapon larger and more visible
    weaponGraphic.setScale(2.0);
    
    // Position at player location
    weaponGraphic.x = player.x;
    weaponGraphic.y = player.y;
    weaponGraphic.rotation = angle + Math.PI / 2;
    
    // Calculate end position
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    // Animate with tween
    this.scene.tweens.add({
      targets: weaponGraphic,
      x: endX,
      y: endY,
      alpha: { from: 1, to: 0, duration: 170, delay: 120 },
      duration: 170, // ~10 frames at 60fps
      ease: 'Quad.easeOut',
      onComplete: () => {
        weaponGraphic.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }

  /**
   * Create sweep animation (whips, flails, scythes)
   * Wide sweeping arc using actual weapon sprite with tween optimization
   */
  createSweep(player, angle, range, weaponSprite = null, weaponType = 'WHIP') {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create appropriate weapon sprite based on weapon type
    let weaponGraphic;
    switch(weaponType) {
      case 'FLAIL':
        weaponGraphic = FlailSprite.create(this.scene);
        break;
      case 'SCYTHE':
        weaponGraphic = ScytheSprite.create(this.scene);
        break;
      default:
        weaponGraphic = WhipSprite.create(this.scene);
    }
    
    // Make weapon larger and more visible
    weaponGraphic.setScale(2.0);
    
    // Calculate start and end positions (wide sweep)
    const distance = range * 0.8;
    const startOffset = -Math.PI * 0.7;
    const endOffset = Math.PI * 0.7;
    
    const startAngle = angle + startOffset;
    const endAngle = angle + endOffset;
    
    const startX = player.x + Math.cos(startAngle) * distance;
    const startY = player.y + Math.sin(startAngle) * distance;
    const endX = player.x + Math.cos(endAngle) * distance;
    const endY = player.y + Math.sin(endAngle) * distance;
    
    // Position at start
    weaponGraphic.x = startX;
    weaponGraphic.y = startY;
    weaponGraphic.rotation = startAngle + Math.PI / 2;
    
    // Animate with tween
    this.scene.tweens.add({
      targets: weaponGraphic,
      x: endX,
      y: endY,
      rotation: endAngle + Math.PI / 2,
      alpha: { from: 1, to: 0, duration: 200, delay: 140 },
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        weaponGraphic.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }

  /**
   * Create punch animation (gauntlets)
   * Impact burst using actual gauntlets sprite with tween optimization
   */
  createPunch(player, angle, range, weaponSprite = null) {
    // Hide the circling weapon sprite during attack
    if (weaponSprite && weaponSprite.graphic) {
      weaponSprite.graphic.setVisible(false);
    }
    
    // Create gauntlets sprite for attack animation
    const gauntlets = GauntletsSprite.create(this.scene);
    
    // Make gauntlets larger and more visible
    gauntlets.setScale(2.5);
    
    // Position gauntlets at player initially
    gauntlets.x = player.x;
    gauntlets.y = player.y;
    gauntlets.rotation = angle + Math.PI / 2;
    
    // Calculate end position
    const endX = player.x + Math.cos(angle) * range;
    const endY = player.y + Math.sin(angle) * range;
    
    // Animate with tween
    this.scene.tweens.add({
      targets: gauntlets,
      x: endX,
      y: endY,
      scaleX: 3.0, // Scale up on impact
      scaleY: 3.0,
      alpha: { from: 1, to: 0, duration: 140, delay: 100 },
      duration: 140, // ~8 frames at 60fps
      ease: 'Quad.easeOut',
      onComplete: () => {
        gauntlets.destroy();
        if (weaponSprite && weaponSprite.graphic) {
          weaponSprite.graphic.setVisible(true);
        }
      }
    });
  }
}
