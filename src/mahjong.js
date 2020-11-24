const Tile = Object.freeze({
  Null: -1,
  Manzu1: 0 /*! 一萬 */,
  Manzu2: 1 /*! 二萬 */,
  Manzu3: 2 /*! 三萬 */,
  Manzu4: 3 /*! 四萬 */,
  Manzu5: 4 /*! 五萬 */,
  Manzu6: 5 /*! 六萬 */,
  Manzu7: 6 /*! 七萬 */,
  Manzu8: 7 /*! 八萬 */,
  Manzu9: 8 /*! 九萬 */,
  Pinzu1: 9 /*! 一筒 */,
  Pinzu2: 10 /*! 二筒 */,
  Pinzu3: 11 /*! 三筒 */,
  Pinzu4: 12 /*! 四筒 */,
  Pinzu5: 13 /*! 五筒 */,
  Pinzu6: 14 /*! 六筒 */,
  Pinzu7: 15 /*! 七筒 */,
  Pinzu8: 16 /*! 八筒 */,
  Pinzu9: 17 /*! 九筒 */,
  Sozu1: 18 /*! 一索 */,
  Sozu2: 19 /*! 二索 */,
  Sozu3: 20 /*! 三索 */,
  Sozu4: 21 /*! 四索 */,
  Sozu5: 22 /*! 五索 */,
  Sozu6: 23 /*! 六索 */,
  Sozu7: 24 /*! 七索 */,
  Sozu8: 25 /*! 八索 */,
  Sozu9: 26 /*! 九索 */,
  Ton: 27 /*! 東 */,
  Nan: 28 /*! 南 */,
  Sya: 29 /*! 西 */,
  Pe: 30 /*! 北 */,
  Haku: 31 /*! 白 */,
  Hatu: 32 /*! 発 */,
  Tyun: 33 /*! 中 */,
  AkaManzu5: 34 /*! 赤五萬 */,
  AkaPinzu5: 35 /*! 赤五筒 */,
  AkaSozu5: 36 /*! 赤五索 */
});

const ManzuTiles = [
  Tile.Manzu1,
  Tile.Manzu2,
  Tile.Manzu3,
  Tile.Manzu4,
  Tile.Manzu5,
  Tile.Manzu6,
  Tile.Manzu7,
  Tile.Manzu8,
  Tile.Manzu9
];

const PinzuTiles = [
  Tile.Pinzu1,
  Tile.Pinzu2,
  Tile.Pinzu3,
  Tile.Pinzu4,
  Tile.Pinzu5,
  Tile.Pinzu6,
  Tile.Pinzu7,
  Tile.Pinzu8,
  Tile.Pinzu9
];

const SozuTiles = [
  Tile.Sozu1,
  Tile.Sozu2,
  Tile.Sozu3,
  Tile.Sozu4,
  Tile.Sozu5,
  Tile.Sozu6,
  Tile.Sozu7,
  Tile.Sozu8,
  Tile.Sozu9
];

const ZihaiTiles = [
  Tile.Ton,
  Tile.Nan,
  Tile.Sya,
  Tile.Pe,
  Tile.Haku,
  Tile.Hatu,
  Tile.Tyun
];

const Seat = Object.freeze({
  Zitya: 0 /*! 自家 */,
  Kamitya: 1 /*! 上家 */,
  Toimen: 2 /*! 対面 */,
  Simotya: 3 /*! 下家 */
});

const order = Object.freeze({
  0: 0, // 萬子
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9, // 筒子
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18, // 索子
  19: 19,
  20: 20,
  21: 21,
  22: 22,
  23: 23,
  24: 24,
  25: 25,
  26: 26,
  27: 27,
  28: 28,
  29: 29,
  30: 30,
  31: 31,
  32: 32,
  33: 33,
  34: 4,
  35: 13,
  36: 22
});

function sort_tiles(tiles) {
  tiles.sort(function(a, b) {
    return order[a] - order[b];
  });
}

const Dora2DoraHyozi = Object.freeze({
  0: 8,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 34,
  6: 5,
  7: 6,
  8: 7,
  9: 17,
  10: 9,
  11: 10,
  12: 11,
  13: 12,
  14: 35,
  15: 14,
  16: 15,
  17: 16,
  18: 26,
  19: 18,
  20: 19,
  21: 20,
  22: 21,
  23: 36,
  24: 23,
  25: 24,
  26: 25,
  27: 30,
  28: 27,
  29: 28,
  30: 29,
  31: 33,
  32: 31,
  33: 32
});

const DoraHyozi2Dora = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5, // 萬子5
  5: 6,
  6: 7,
  7: 8,
  8: 0,
  9: 10,
  10: 11,
  11: 12,
  12: 13,
  13: 14, // 筒子5
  14: 15,
  15: 16,
  16: 17,
  17: 9,
  18: 19,
  19: 20,
  20: 21,
  21: 22,
  22: 23, // 索子5
  23: 24,
  24: 25,
  25: 26,
  26: 18,
  27: 28,
  28: 29,
  29: 30,
  30: 27,
  31: 32,
  32: 33,
  33: 31,
  34: 5,
  35: 14,
  36: 23
};

export {
  Tile,
  ManzuTiles,
  PinzuTiles,
  SozuTiles,
  ZihaiTiles,
  Seat,
  sort_tiles,
  Dora2DoraHyozi,
  DoraHyozi2Dora
};
