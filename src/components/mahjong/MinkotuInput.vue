<template>
  <b-table-simple class="table">
    <b-tbody>
      <!-- 萬子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in ManzuTiles"
            :key="tile"
            :block="createMinkotu(tile)"
            :disabled="disabled(createMinkotu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            :block="createMinkotu(Tile.Manzu5, true)"
            :disabled="disabled(createMinkotu(Tile.Manzu5, true))"
          />
        </b-td>
      </b-tr>
      <!-- 筒子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in PinzuTiles"
            :key="tile"
            :block="createMinkotu(tile)"
            :disabled="disabled(createMinkotu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            :block="createMinkotu(Tile.Pinzu5, true)"
            :disabled="disabled(createMinkotu(Tile.Pinzu5, true))"
          />
        </b-td>
      </b-tr>
      <!-- 索子 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in SozuTiles"
            :key="tile"
            :block="createMinkotu(tile)"
            :disabled="disabled(createMinkotu(tile))"
          />
          <BlockButton
            @click-block="add_block"
            :block="createMinkotu(Tile.Sozu5, true)"
            :disabled="disabled(createMinkotu(Tile.Sozu5, true))"
          />
        </b-td>
      </b-tr>
      <!-- 字牌 -->
      <b-tr>
        <b-td class="melded_blocks">
          <BlockButton
            @click-block="add_block"
            v-for="tile in ZihaiTiles"
            :key="tile"
            :block="createMinkotu(tile)"
            :disabled="disabled(createMinkotu(tile))"
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
    // 明刻子を作成する。
    createMinkotu(tile, akahai = false) {
      let tiles = Array(3).fill(tile);

      if (akahai) {
        if (tile == Tile.Manzu5) tiles[0] = Tile.AkaManzu5;
        else if (tile == Tile.Pinzu5) tiles[0] = Tile.AkaPinzu5;
        else if (tile == Tile.Sozu5) tiles[0] = Tile.AkaSozu5;
      }

      return {
        type: MeldType.Pon,
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
        // 手牌が12枚以上、牌が3枚残っていない、または赤牌が残っていない場合
        this.numHandTiles >= 12 ||
        this.tileCounts[block.tiles[2]] < 3 ||
        this.tileCounts[block.tiles[0]] == 0
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
