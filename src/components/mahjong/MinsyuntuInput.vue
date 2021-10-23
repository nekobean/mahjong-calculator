<template>
  <div>
    <b-table-simple class="table">
      <b-tbody>
        <!-- 萬子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">萬子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              @add-block="add_block"
              v-for="tile in ManzuTiles.slice(0, 7)"
              :key="tile"
              :block="create_minsyuntu(tile)"
              :disabled="is_disabled(create_minsyuntu(tile))"
            />
            <BlockButton
              @add-block="add_block"
              v-for="tile in ManzuTiles.slice(2, 5)"
              :key="tile + 'aka'"
              :block="create_minsyuntu(tile, true)"
              :disabled="is_disabled(create_minsyuntu(tile, true))"
            />
          </b-td>
        </b-tr>
        <!-- 筒子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">筒子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              @add-block="add_block"
              v-for="tile in PinzuTiles.slice(0, 7)"
              :key="tile"
              :block="create_minsyuntu(tile)"
              :disabled="is_disabled(create_minsyuntu(tile))"
            />
            <BlockButton
              @add-block="add_block"
              v-for="tile in PinzuTiles.slice(2, 5)"
              :key="tile + 'aka'"
              :block="create_minsyuntu(tile, true)"
              :disabled="is_disabled(create_minsyuntu(tile, true))"
            />
          </b-td>
        </b-tr>
        <!-- 索子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">索子</b-th>
          <b-td class="melded_blocks">
            <BlockButton
              @add-block="add_block"
              v-for="tile in SozuTiles.slice(0, 7)"
              :key="tile"
              :block="create_minsyuntu(tile)"
              :disabled="is_disabled(create_minsyuntu(tile))"
            />
            <BlockButton
              @add-block="add_block"
              v-for="tile in SozuTiles.slice(2, 5)"
              :key="tile + 'aka'"
              :block="create_minsyuntu(tile, true)"
              :disabled="is_disabled(create_minsyuntu(tile, true))"
            />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
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
  components: {
    BlockButton,
  },
  props: {
    tile_counts: {
      type: Array,
      required: true,
    },
    n_hand_tiles: {
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
    create_minsyuntu(min_tile, akahai = false) {
      let tiles = [];
      for (let i = 0; i < 3; ++i) {
        let tile = min_tile + i;
        if (akahai && min_tile + i == Tile.Manzu5) tile = Tile.AkaManzu5;
        else if (akahai && min_tile + i == Tile.Pinzu5) tile = Tile.AkaPinzu5;
        else if (akahai && min_tile + i == Tile.Sozu5) tile = Tile.AkaSozu5;

        tiles.push(tile);
      }

      return {
        type: MeldType.Ti,
        tiles: tiles,
        discarded_tile: tiles[0],
        from: 3,
      };
    },

    add_block(block) {
      this.$emit("add-block", block);
    },

    is_disabled(block) {
      return (
        this.n_hand_tiles >= 12 ||
        block.tiles.some((x) => this.tile_counts[x] === 0)
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
