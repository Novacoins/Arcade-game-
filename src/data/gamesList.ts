/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameDefinition } from '../types';

import skyFlightCover from '../assets/images/sky_flight_cover_1784574742482.jpg';
import gemMinesCover from '../assets/images/gem_mines_cover_1784574759024.jpg';
import diamondPlinkoCover from '../assets/images/diamond_plinko_cover_1784574774752.jpg';
import luckyWheelCover from '../assets/images/lucky_wheel_cover_1784574792500.jpg';
import cardDuelCover from '../assets/images/card_duel_cover_1784574806660.jpg';
import coinClashCover from '../assets/images/coin_clash_cover_1784574820817.jpg';
import luckyBottleCover from '../assets/images/lucky_bottle_cover_1784574835379.jpg';
import colorMatchCover from '../assets/images/color_match_cover_1784574854173.jpg';
import numberDashCover from '../assets/images/number_dash_cover_1784574868972.jpg';
import diceArenaCover from '../assets/images/dice_arena_cover_1784574886987.jpg';
import memoryFlipCover from '../assets/images/memory_flip_cover_1784574903745.jpg';
import treasureHuntCover from '../assets/images/treasure_hunt_cover_1784574919453.jpg';
import goalChallengeCover from '../assets/images/goal_challenge_cover_1784574933698.jpg';
import rocketRunCover from '../assets/images/rocket_run_cover_1784574948732.jpg';
import racingRushCover from '../assets/images/racing_rush_cover_1784574966297.jpg';
import fishingFrenzyCover from '../assets/images/fishing_frenzy_cover_1784574981435.jpg';
import fruitSliceCover from '../assets/images/fruit_slice_cover_1784574995017.jpg';
import bubblePopCover from '../assets/images/bubble_pop_cover_1784575009285.jpg';
import brickSmashCover from '../assets/images/brick_smash_cover_1784575024709.jpg';
import jewelPuzzleCover from '../assets/images/jewel_puzzle_cover_1784575039573.jpg';

export const GAME_CATEGORIES = [
  'All',
  'Crash Games',
  'Arcade Games',
  'Card Games',
  'Dice Games',
  'Plinko Games',
  'Mines Games',
  'Slot Games',
  'Virtual Sports',
  'Sports Skill Games',
  'Racing Games',
  'Puzzle Games',
  'Lucky Wheel Games',
  'Coin Flip Games',
  'Number Prediction Games',
  'Memory Games',
  'Quick Games',
  'Jackpot Games',
];

export const GAMES_LIST: GameDefinition[] = [
  {
    id: 'sky_flight',
    title: 'Sky Flight',
    category: 'Crash Games',
    description: 'A classic crash multiplier. Cashing out before the spaceship escapes is the ultimate test of nerves.',
    thumbnail: skyFlightCover,
    isPopular: true,
    isNew: false,
    multiplier: '9999.0x',
    playCount: 148200
  },
  {
    id: 'gem_mines',
    title: 'Gem Mines',
    category: 'Mines Games',
    description: 'Mine precious crystals on a grid. Keep searching but beware of hidden hazards.',
    thumbnail: gemMinesCover,
    isPopular: true,
    isNew: false,
    multiplier: '500.0x',
    playCount: 94810
  },
  {
    id: 'diamond_plinko',
    title: 'Diamond Plinko',
    category: 'Plinko Games',
    description: 'Bounce the shining diamond down the peg board and target maximum multiplier slots.',
    thumbnail: diamondPlinkoCover,
    isPopular: true,
    isNew: true,
    multiplier: '100.0x',
    playCount: 82140
  },
  {
    id: 'lucky_wheel',
    title: 'Lucky Wheel',
    category: 'Lucky Wheel Games',
    description: 'Spin the grand golden roulette wheel of fortune to claim high-multiplier multipliers.',
    thumbnail: luckyWheelCover,
    isPopular: true,
    isNew: false,
    multiplier: '50.0x',
    playCount: 120530
  },
  {
    id: 'card_duel',
    title: 'Card Duel',
    category: 'Card Games',
    description: 'Blackjack-inspired cards challenge. Get closer to 21 than the master computer.',
    thumbnail: cardDuelCover,
    isPopular: false,
    isNew: false,
    multiplier: '2.0x',
    playCount: 42900
  },
  {
    id: 'coin_clash',
    title: 'Coin Clash',
    category: 'Coin Flip Games',
    description: 'Predict whether the dual-sided golden coin will fall Heads or Tails. Instant payouts.',
    thumbnail: coinClashCover,
    isPopular: false,
    isNew: false,
    multiplier: '1.98x',
    playCount: 61500
  },
  {
    id: 'lucky_bottle',
    title: 'Lucky Bottle',
    category: 'Lucky Wheel Games',
    description: 'Spin the premium dynamic bottle on the circular stage and aim for multipliers.',
    thumbnail: luckyBottleCover,
    isPopular: true,
    isNew: true,
    multiplier: '12.0x',
    playCount: 52400
  },
  {
    id: 'color_match',
    title: 'Color Match',
    category: 'Number Prediction Games',
    description: 'Will the next dynamic light flash Red, Green, or Violet? Perfect quick payouts.',
    thumbnail: colorMatchCover,
    isPopular: false,
    isNew: false,
    multiplier: '9.0x',
    playCount: 31200
  },
  {
    id: 'number_dash',
    title: 'Number Dash',
    category: 'Number Prediction Games',
    description: 'Input your lucky predictions. Dash up the ladder with instant high payouts.',
    thumbnail: numberDashCover,
    isPopular: false,
    isNew: false,
    multiplier: '99.0x',
    playCount: 22800
  },
  {
    id: 'dice_arena',
    title: 'Dice Arena',
    category: 'Dice Games',
    description: 'Roll the professional dynamic 3D dice. Play high or low against the dealer.',
    thumbnail: diceArenaCover,
    isPopular: false,
    isNew: false,
    multiplier: '6.0x',
    playCount: 41500
  },
  {
    id: 'memory_flip',
    title: 'Memory Flip',
    category: 'Memory Games',
    description: 'Test your cognitive memory. Pair up matching gold cards within the speed limit.',
    thumbnail: memoryFlipCover,
    isPopular: false,
    isNew: false,
    multiplier: '5.0x',
    playCount: 19800
  },
  {
    id: 'treasure_hunt',
    title: 'Treasure Hunt',
    category: 'Quick Games',
    description: 'Open classic mystery chests. Discover massive multipliers or dusty empty boxes.',
    thumbnail: treasureHuntCover,
    isPopular: true,
    isNew: true,
    multiplier: '25.0x',
    playCount: 71200
  },
  {
    id: 'goal_challenge',
    title: 'Goal Challenge',
    category: 'Sports Skill Games',
    description: 'Step up to the penalty spot. Shoot past the goalkeeper to score and multiply rewards.',
    thumbnail: goalChallengeCover,
    isPopular: true,
    isNew: true,
    multiplier: '15.0x',
    playCount: 89300
  },
  {
    id: 'rocket_run',
    title: 'Rocket Run',
    category: 'Racing Games',
    description: 'Guide the pixel rocket through space debris obstacles. Earn diamonds for distance.',
    thumbnail: rocketRunCover,
    isPopular: false,
    isNew: false,
    multiplier: '10.0x',
    playCount: 38400
  },
  {
    id: 'racing_rush',
    title: 'Racing Rush',
    category: 'Racing Games',
    description: 'Fast-paced highway racer. Dodge traffic and collect gold bonus coins.',
    thumbnail: racingRushCover,
    isPopular: false,
    isNew: true,
    multiplier: '8.0x',
    playCount: 46200
  },
  {
    id: 'fishing_frenzy',
    title: 'Fishing Frenzy',
    category: 'Arcade Games',
    description: 'Catch valuable deep-sea marine life. Double hooks mean double bonuses.',
    thumbnail: fishingFrenzyCover,
    isPopular: false,
    isNew: false,
    multiplier: '20.0x',
    playCount: 34100
  },
  {
    id: 'fruit_slice',
    title: 'Fruit Slice',
    category: 'Arcade Games',
    description: 'Frenetic slicing action. Chop multiple fruits sequentially to trigger bonus multipliers.',
    thumbnail: fruitSliceCover,
    isPopular: false,
    isNew: false,
    multiplier: '12.0x',
    playCount: 50400
  },
  {
    id: 'bubble_pop',
    title: 'Bubble Pop',
    category: 'Arcade Games',
    description: 'Match colors and burst large clusters of hanging bubbles before time expires.',
    thumbnail: bubblePopCover,
    isPopular: false,
    isNew: false,
    multiplier: '6.0x',
    playCount: 28500
  },
  {
    id: 'brick_smash',
    title: 'Brick Smash',
    category: 'Arcade Games',
    description: 'The definitive bricks breaker. Grab special powerups to double your balls.',
    thumbnail: brickSmashCover,
    isPopular: false,
    isNew: false,
    multiplier: '10.0x',
    playCount: 33100
  },
  {
    id: 'jewel_puzzle',
    title: 'Jewel Puzzle',
    category: 'Puzzle Games',
    description: 'Elegant match-3 mechanics. Destroy lines and grid columns to score mega multipliers.',
    thumbnail: jewelPuzzleCover,
    isPopular: false,
    isNew: false,
    multiplier: '15.0x',
    playCount: 41200
  }
];
