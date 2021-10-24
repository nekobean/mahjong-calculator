<template>
  <b-table-simple>
    <b-tbody>
      <!-- 萬子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in ManzuTiles.slice(0, 7)"
            :key="tile"
            :block="createMinsyuntu(tile)"
            :disabled="disabled(createMinsyuntu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            v-for="tile in ManzuTiles.slice(2, 5)"
            :key="tile + 'aka'"
            :block="createMinsyuntu(tile, true)"
            :disabled="disabled(createMinsyuntu(tile, true))"
          />
        </b-td>
      </b-tr>
      <!-- 筒子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in PinzuTiles.slice(0, 7)"
            :key="tile"
            :block="createMinsyuntu(tile)"
            :disabled="disabled(createMinsyuntu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            v-for="tile in PinzuTiles.slice(2, 5)"
            :key="tile + 'aka'"
            :block="createMinsyuntu(tile, true)"
            :disabled="disabled(createMinsyuntu(tile, true))"
          />
        </b-td>
      </b-tr>
      <!-- 索子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in SozuTiles.slice(0, 7)"
            :key="tile"
            :block="createMinsyuntu(tile)"
            :disabled="disabled(createMinsyuntu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            v-for="tile in SozuTiles.slice(2, 5)"
            :key="tile + 'aka'"
            :block="createMinsyuntu(tile, true)"
            :disabled="disabled(createMinsyuntu(tile, true))"
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
  name: "MinsyuntuInput",
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
    // 明順子を作成する。
    createMinsyuntu(min_tile, akahai = false) {
      let tiles = [];
      for (let i = 0; i < 3; ++i) {
        let tile = min_tile + i;
        if (akahai && tile == Tile.Manzu5) tile = Tile.AkaManzu5;
        else if (akahai && tile == Tile.Pinzu5) tile = Tile.AkaPinzu5;
        else if (akahai && tile == Tile.Sozu5) tile = Tile.AkaSozu5;

        tiles.push(tile);
      }

      return {
        type: MeldType.Ti,
        tiles: tiles,
        discardedTile: tiles[0] /* ブロックの1枚目の牌を鳴いた */,
        from: 3 /* 上家 */,
      };
    },

    add_block(block) {
      this.$emit("add-block", block);
    },
    // 無効にするかどうかを返す。
    disabled(block) {
      return (
        this.numHandTiles >= 12 ||
        block.tiles.some((x) => this.tileCounts[x] === 0)
      );
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
