/**
 * WeaponSpriteFactory
 * Centralized factory for creating weapon sprites
 */
import WandSprite from './WandSprite.js';
import StaffSprite from './StaffSprite.js';
import GreatswordSprite from './GreatswordSprite.js';
import SwordSprite from './SwordSprite.js';
import KatanaSprite from './KatanaSprite.js';
import RapierSprite from './RapierSprite.js';
import DaggerSprite from './DaggerSprite.js';
import ShurikenSprite from './ShurikenSprite.js';
import ChakramSprite from './ChakramSprite.js';
import BowSprite from './BowSprite.js';
import CrossbowSprite from './CrossbowSprite.js';
import AxeSprite from './AxeSprite.js';
import SpearSprite from './SpearSprite.js';
import LanceSprite from './LanceSprite.js';
import HammerSprite from './HammerSprite.js';
import MaceSprite from './MaceSprite.js';
import FlailSprite from './FlailSprite.js';
import WhipSprite from './WhipSprite.js';
import ScytheSprite from './ScytheSprite.js';
import GauntletsSprite from './GauntletsSprite.js';

export default class WeaponSpriteFactory {
  /**
   * Map of weapon types to their sprite classes
   */
  static SPRITE_MAP = {
    WAND: WandSprite,
    STAFF: StaffSprite,
    GREATSWORD: GreatswordSprite,
    SWORD: SwordSprite,
    KATANA: KatanaSprite,
    RAPIER: RapierSprite,
    DAGGER: DaggerSprite,
    SHURIKEN: ShurikenSprite,
    CHAKRAM: ChakramSprite,
    BOW: BowSprite,
    CROSSBOW: CrossbowSprite,
    AXE: AxeSprite,
    SPEAR: SpearSprite,
    LANCE: LanceSprite,
    HAMMER: HammerSprite,
    MACE: MaceSprite,
    FLAIL: FlailSprite,
    WHIP: WhipSprite,
    SCYTHE: ScytheSprite,
    GAUNTLETS: GauntletsSprite
  };

  /**
   * Create a weapon sprite with its distance
   * @param {Phaser.Scene} scene - The scene to create the sprite in
   * @param {string} weaponType - Type of weapon
   * @param {string} weaponDataType - Weapon data type ('melee' or 'ranged') for fallback
   * @returns {{graphic: Phaser.GameObjects.Graphics, distance: number}} Weapon sprite and distance
   */
  static create(scene, weaponType, weaponDataType = 'melee') {
    const SpriteClass = this.SPRITE_MAP[weaponType];
    
    if (SpriteClass) {
      return {
        graphic: SpriteClass.create(scene),
        distance: SpriteClass.getDistance()
      };
    }
    
    // Fallback for weapons without sprite modules
    return this.createFallback(scene, weaponDataType);
  }

  /**
   * Create fallback sprite for weapons without dedicated sprite classes
   * @param {Phaser.Scene} scene - The scene to create the sprite in
   * @param {string} weaponDataType - Weapon data type ('melee' or 'ranged')
   * @returns {{graphic: Phaser.GameObjects.Graphics, distance: number}} Fallback sprite and distance
   */
  static createFallback(scene, weaponDataType) {
    const graphics = scene.add.graphics();
    const distance = 40;
    
    if (weaponDataType === 'ranged') {
      // Ranged weapon - draw as a line/bow
      graphics.lineStyle(3, 0x00ffff);
      graphics.lineBetween(-10, 0, 10, 0);
    } else {
      // Melee weapon - draw as a rectangle/sword
      graphics.fillStyle(0xcccccc);
      graphics.fillRect(-3, -15, 6, 30);
    }
    
    return { graphic: graphics, distance };
  }
}
