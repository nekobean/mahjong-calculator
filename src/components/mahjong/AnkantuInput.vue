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
            :block="createAnkantuBlock(tile)"
            :disabled="disabled(createAnkantuBlock(tile))"
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
            :block="createAnkantuBlock(tile)"
            :disabled="disabled(createAnkantuBlock(tile))"
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
            :block="createAnkantuBlock(tile)"
            :disabled="disabled(createAnkantuBlock(tile))"
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
            :block="createAnkantuBlock(tile)"
            :disabled="disabled(createAnkantuBlock(tile))"
          />
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import {
  Tile,
  ManzuTiles,
  PinzuTiles,
  SozuTiles,
  ZihaiTiles,
  MeldType,
} from "@/mahjong.js";

import BlockButton from "./BlockButton.vue";

export default {
  name: "AnkantuInput",
  components: {
    BlockButton,
  },
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
    // 暗槓子を作成する
    createAnkantuBlock(tile) {
      let tiles = Array(4).fill(tile);

      return {
        type: MeldType.Ankan,
        tiles: tiles,
        discardedTile: tiles[0] /* 1個目の牌を鳴いた */,
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
