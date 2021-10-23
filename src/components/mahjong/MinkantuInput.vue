<template>
  <b-table-simple class="table">
    <b-tbody>
      <!-- 萬子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @add-block="add_block"
            v-for="tile in ManzuTiles"
            :key="tile"
            :block="createMinkantu(tile)"
            :disabled="disabled(createMinkantu(tile))"
          />
        </b-td>
      </b-tr>
      <!-- 筒子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @add-block="add_block"
            v-for="tile in PinzuTiles"
            :key="tile"
            :block="createMinkantu(tile)"
            :disabled="disabled(createMinkantu(tile))"
          />
        </b-td>
      </b-tr>
      <!-- 索子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @add-block="add_block"
            v-for="tile in SozuTiles"
            :key="tile"
            :block="createMinkantu(tile)"
            :disabled="disabled(createMinkantu(tile))"
          />
        </b-td>
      </b-tr>
      <!-- 字牌 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @add-block="add_block"
            v-for="tile in ZihaiTiles"
            :key="tile"
            :block="createMinkantu(tile)"
            :disabled="disabled(createMinkantu(tile))"
          />
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import BlockButton from "./BlockButton.vue";
import {
  Tile,
  ManzuTiles,
  PinzuTiles,
  SozuTiles,
  ZihaiTiles,
  MeldType,
} from "@/mahjong.js";

export default {
  name: "MinkotuInput",
  components: { BlockButton },
  props: {
    // 牌の残り枚数
    tileCounts: {
      type: Array,
      required: true,
    },
    // 手牌の枚数
    numHandTiles: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      Tile: Tile,
      ManzuTiles: ManzuTiles,
      PinzuTiles: PinzuTiles,
      SozuTiles: SozuTiles,
      ZihaiTiles: ZihaiTiles,
    };
  },
  methods: {
    // 明槓子を作成する
    createMinkantu(tile) {
      let tiles = Array(4).fill(tile);

      // 槓子が赤牌を含む場合、1枚目を赤牌にする。
      if (tile == Tile.Manzu5) tiles[0] = Tile.AkaManzu5;
      else if (tile == Tile.Pinzu5) tiles[0] = Tile.AkaPinzu5;
      else if (tile == Tile.Sozu5) tiles[0] = Tile.AkaSozu5;

      return {
        type: MeldType.Minkan,
        tiles: tiles,
        discardedTile: tiles[0] /* ブロックの1枚目の牌を鳴いた */,
        from: 3 /* 上家 */,
      };
    },

    add_block(block) {
      this.$emit("add-block", block);
    },

    disabled(block) {
      return this.numHandTiles >= 12 || this.tileCounts[block.tiles[3]] != 4;
    },
  },
};
</script>

<style scoped>
.melded_blocks {
  display: flex;
  flex-wrap: wrap;
}

.melded_blocks > * {
  margin: 5px;
}
</style>
