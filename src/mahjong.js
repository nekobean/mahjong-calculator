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

const Tile2String = new Map([
  [Tile.Manzu1, "一萬"],
  [Tile.Manzu2, "二萬"],
  [Tile.Manzu3, "三萬"],
  [Tile.Manzu4, "四萬"],
  [Tile.Manzu5, "五萬"],
  [Tile.Manzu6, "六萬"],
  [Tile.Manzu7, "七萬"],
  [Tile.Manzu8, "八萬"],
  [Tile.Manzu9, "九萬"],
  [Tile.Pinzu1, "一筒"],
  [Tile.Pinzu2, "二筒"],
  [Tile.Pinzu3, "三筒"],
  [Tile.Pinzu4, "四筒"],
  [Tile.Pinzu5, "五筒"],
  [Tile.Pinzu6, "六筒"],
  [Tile.Pinzu7, "七筒"],
  [Tile.Pinzu8, "八筒"],
  [Tile.Pinzu9, "九筒"],
  [Tile.Sozu1, "一索"],
  [Tile.Sozu2, "二索"],
  [Tile.Sozu3, "三索"],
  [Tile.Sozu4, "四索"],
  [Tile.Sozu5, "五索"],
  [Tile.Sozu6, "六索"],
  [Tile.Sozu7, "七索"],
  [Tile.Sozu8, "八索"],
  [Tile.Sozu9, "九索"],
  [Tile.Ton, "東"],
  [Tile.Nan, "南"],
  [Tile.Sya, "西"],
  [Tile.Pe, "北"],
  [Tile.Haku, "白"],
  [Tile.Hatu, "発"],
  [Tile.Tyun, "中"],
  [Tile.AkaManzu5, "赤五萬"],
  [Tile.AkaPinzu5, "赤五筒"],
  [Tile.AkaSozu5, "赤五索"]
]);

const Tile2MPSString = new Map([
  [Tile.Manzu1, "1"],
  [Tile.Manzu2, "2"],
  [Tile.Manzu3, "3"],
  [Tile.Manzu4, "4"],
  [Tile.Manzu5, "5"],
  [Tile.Manzu6, "6"],
  [Tile.Manzu7, "7"],
  [Tile.Manzu8, "8"],
  [Tile.Manzu9, "9"],
  [Tile.Pinzu1, "1"],
  [Tile.Pinzu2, "2"],
  [Tile.Pinzu3, "3"],
  [Tile.Pinzu4, "4"],
  [Tile.Pinzu5, "5"],
  [Tile.Pinzu6, "6"],
  [Tile.Pinzu7, "7"],
  [Tile.Pinzu8, "8"],
  [Tile.Pinzu9, "9"],
  [Tile.Sozu1, "1"],
  [Tile.Sozu2, "2"],
  [Tile.Sozu3, "3"],
  [Tile.Sozu4, "4"],
  [Tile.Sozu5, "5"],
  [Tile.Sozu6, "6"],
  [Tile.Sozu7, "7"],
  [Tile.Sozu8, "8"],
  [Tile.Sozu9, "9"],
  [Tile.Ton, "東"],
  [Tile.Nan, "南"],
  [Tile.Sya, "西"],
  [Tile.Pe, "北"],
  [Tile.Haku, "白"],
  [Tile.Hatu, "発"],
  [Tile.Tyun, "中"],
  [Tile.AkaManzu5, "r5"],
  [Tile.AkaPinzu5, "r5"],
  [Tile.AkaSozu5, "r5"]
]);

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

const TileOrder = Object.freeze({
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

const TilePriority = Object.freeze({
  0: 1, // 萬子
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 4,
  6: 3,
  7: 2,
  8: 1,
  9: 1, // 筒子
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 4,
  15: 3,
  16: 2,
  17: 1,
  18: 1, // 索子
  19: 2,
  20: 3,
  21: 4,
  22: 5,
  23: 4,
  24: 3,
  25: 2,
  26: 1,
  27: 1,
  28: 1,
  29: 1,
  30: 1,
  31: 1,
  32: 1,
  33: 1,
  34: 5,
  35: 5,
  36: 5
});

function sort_tiles(tiles) {
  tiles.sort(function(a, b) {
    return TileOrder[a] - TileOrder[b];
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

const SyantenType = Object.freeze({
  Normal: 1 /*! 一般手 */,
  Tiitoi: 2 /*! 七対子手 */,
  Kokusi: 4 /*! 国士無双手 */
});

const SyantenType2String = new Map([
  [SyantenType.Normal, "一般手"],
  [SyantenType.Tiitoi, "七対子手"],
  [SyantenType.Kokusi, "国士無双手"]
]);

const MeldType = Object.freeze({
  Pon: 0 /* ポン */,
  Ti: 1 /* チー */,
  Ankan: 2 /* 暗槓 */,
  Minkan: 3 /* 明槓 */,
  Kakan: 4 /* 加槓 */
});

const MeldType2String = new Map([
  [MeldType.Pon, "ポン"],
  [MeldType.Ti, "チー"],
  [MeldType.Ankan, "暗槓"],
  [MeldType.Minkan, "明槓"],
  [MeldType.Kakan, "加槓"]
]);

let Hand2String = function(tiles) {
  tiles.concat().sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

  let manzu = [];
  let pinzu = [];
  let sozu = [];
  let zihai = [];
  for (let tile of tiles) {
    if (tile <= Tile.Manzu9 || tile == Tile.AkaManzu5) {
      manzu.push(tile);
    } else if (tile <= Tile.Pinzu9 || tile == Tile.AkaPinzu5) {
      pinzu.push(tile);
    } else if (tile <= Tile.Sozu9 || tile == Tile.AkaSozu5) {
      sozu.push(tile);
    } else {
      zihai.push(tile);
    }
  }

  let str = "";
  if (manzu.length) {
    str += manzu.map(x => Tile2MPSString.get(x)).join("") + "m";
  }
  if (pinzu.length) {
    str += pinzu.map(x => Tile2MPSString.get(x)).join("") + "p";
  }
  if (sozu.length) {
    str += sozu.map(x => Tile2MPSString.get(x)).join("") + "s";
  }
  str += zihai.map(x => Tile2MPSString.get(x)).join("");

  return str;
};

let Meld2String = function(meld) {
  return `[${MeldType2String.get(meld.type)}, ${Hand2String(meld.tiles)}]`;
};

export {
  Tile,
  ManzuTiles,
  PinzuTiles,
  SozuTiles,
  ZihaiTiles,
  Seat,
  sort_tiles,
  TileOrder,
  Dora2DoraHyozi,
  DoraHyozi2Dora,
  Tile2String,
  SyantenType,
  SyantenType2String,
  Tile2MPSString,
  Hand2String,
  MeldType,
  MeldType2String,
  Meld2String,
  TilePriority
};
