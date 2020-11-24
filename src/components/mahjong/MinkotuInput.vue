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
              :block="create_minkotu(tile)"
              :disabled="is_disabled(create_minkotu(tile))"
            />
            <BlockButton
              v-on:add-block="add_block"
              :block="create_minkotu(Tile.Manzu5, true)"
              :disabled="is_disabled(create_minkotu(Tile.Manzu5, true))"
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
              :block="create_minkotu(tile)"
              :disabled="is_disabled(create_minkotu(tile))"
            />
            <BlockButton
              v-on:add-block="add_block"
              :block="create_minkotu(Tile.Pinzu5, true)"
              :disabled="is_disabled(create_minkotu(Tile.Pinzu5, true))"
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
              :block="create_minkotu(tile)"
              :disabled="is_disabled(create_minkotu(tile))"
            />
            <BlockButton
              v-on:add-block="add_block"
              :block="create_minkotu(Tile.Sozu5, true)"
              :disabled="is_disabled(create_minkotu(Tile.Sozu5, true))"
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
              :block="create_minkotu(tile)"
              :disabled="is_disabled(create_minkotu(tile))"
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
} from "@/mahjong.js";

export default {
  name: "MinkotuInput",
  components: {
    BlockButton,
  },
  props: {
    n_left_tiles: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
    create_minkotu(tile, akahai = false) {
      let tiles = Array(3).fill(tile);

      if (akahai) {
        if (tile == Tile.Manzu5) tiles[0] = Tile.AkaManzu5;
        else if (tile == Tile.Pinzu5) tiles[0] = Tile.AkaPinzu5;
        else if (tile == Tile.Sozu5) tiles[0] = Tile.AkaSozu5;
      }

      return {
        type: "Pon",
        tiles: tiles,
        discarded_tile: tiles[0],
        from: 3 /* 上家 */,
      };
    },

    add_block(block) {
      this.$emit("add-block", block);
    },

    is_disabled(block) {
      if (this.disabled) return true;

      for (let tile of block.tiles) {
        if (this.n_left_tiles[tile] == 0) return true;
      }

      return false;
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
