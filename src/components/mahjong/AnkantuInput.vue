<template>
  <div>
    <b-table-simple class="table">
      <b-tbody>
        <!-- 萬子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">萬子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              v-on:add-block="add_block"
              v-for="tile in ManzuTiles"
              :key="tile"
              :block="create_ankantu(tile)"
              :disabled="is_disabled(create_ankantu(tile))"
            />
          </b-td>
        </b-tr>
        <!-- 筒子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">筒子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              v-on:add-block="add_block"
              v-for="tile in PinzuTiles"
              :key="tile"
              :block="create_ankantu(tile)"
              :disabled="is_disabled(create_ankantu(tile))"
            />
          </b-td>
        </b-tr>
        <!-- 索子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">索子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              v-on:add-block="add_block"
              v-for="tile in SozuTiles"
              :key="tile"
              :block="create_ankantu(tile)"
              :disabled="is_disabled(create_ankantu(tile))"
            />
          </b-td>
        </b-tr>
        <!-- 字牌 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">字牌</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              v-on:add-block="add_block"
              v-for="tile in ZihaiTiles"
              :key="tile"
              :block="create_ankantu(tile)"
              :disabled="is_disabled(create_ankantu(tile))"
            />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import {
  Tile,
  ManzuTiles,
  PinzuTiles,
  SozuTiles,
  ZihaiTiles,
  MeldType
} from "@/mahjong.js";

import BlockButton from "./BlockButton.vue";

export default {
  name: "AnkantuInput",
  components: {
    BlockButton
  },
  props: {
    tile_counts: {
      type: Array,
      required: true
    },
    n_hand_tiles: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      Tile: Tile,
      ManzuTiles: ManzuTiles,
      PinzuTiles: PinzuTiles,
      SozuTiles: SozuTiles,
      ZihaiTiles: ZihaiTiles
    };
  },
  methods: {
    create_ankantu(tile) {
      let tiles = Array(4).fill(tile);

      return {
        type: MeldType.Ankan,
        tiles: tiles,
        discarded_tile: tiles[0] /* 1個目の牌を鳴いた */,
        from: 3 /* 上家 */
      };
    },

    add_block(block) {
      this.$emit("add-block", block);
    },

    is_disabled(block) {
      return (
        this.n_hand_tiles >= 12 ||
        block.tiles.some(x => this.tile_counts[x] === 0)
      );
    }
  }
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
