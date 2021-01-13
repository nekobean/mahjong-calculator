<template>
  <div>
    <b-table-simple class="table">
      <b-tbody>
        <!-- 萬子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">萬子</b-th>
          <b-td class="tiles">
            <TileButton
              v-on:add-tile="add_tile"
              v-for="tile in ManzuTiles"
              :key="tile"
              :tile="tile"
              :disabled="is_disabled(tile)"
            />
            <TileButton
              v-on:add-tile="add_tile"
              :tile="Tile.AkaManzu5"
              :disabled="is_disabled(Tile.AkaManzu5)"
            />
          </b-td>
        </b-tr>
        <!-- 筒子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">筒子</b-th>
          <b-td class="tiles">
            <TileButton
              v-on:add-tile="add_tile"
              v-for="tile in PinzuTiles"
              :key="tile"
              :tile="tile"
              :disabled="is_disabled(tile)"
            />
            <TileButton
              v-on:add-tile="add_tile"
              :tile="Tile.AkaPinzu5"
              :disabled="is_disabled(Tile.AkaPinzu5)"
            />
          </b-td>
        </b-tr>
        <!-- 索子 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">索子</b-th>
          <b-td class="tiles">
            <TileButton
              v-on:add-tile="add_tile"
              v-for="tile in SozuTiles"
              :key="tile"
              :tile="tile"
              :disabled="is_disabled(tile)"
            />
            <TileButton
              v-on:add-tile="add_tile"
              :tile="Tile.AkaSozu5"
              :disabled="is_disabled(Tile.AkaSozu5)"
            />
          </b-td>
        </b-tr>
        <!-- 字牌 -->
        <b-tr>
          <b-th class="text-center align-middle text-nowrap">字牌</b-th>
          <b-td class="tiles">
            <TileButton
              v-on:add-tile="add_tile"
              v-for="tile in ZihaiTiles"
              :key="tile"
              :tile="tile"
              :disabled="is_disabled(tile)"
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
  ZihaiTiles
} from "@/mahjong.js";
import TileButton from "./TileButton.vue";

export default {
  name: "HandTileInput",
  components: {
    TileButton
  },
  props: {
    tile_counts: {
      type: Array,
      required: true
    },
    n_hand_tiles: {
      type: Number,
      default: null
    },
    n_dora_tiles: {
      type: Number,
      default: null
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
    add_tile(tile) {
      this.$emit("add-tile", tile);
    },

    is_disabled(tile) {
      if (this.n_hand_tiles)
        return this.n_hand_tiles >= 14 || this.tile_counts[tile] == 0;
      else return this.n_dora_tiles >= 5 || this.tile_counts[tile] == 0;
    }
  }
};
</script>

<style scoped>
.tiles {
  display: flex;
  flex-wrap: wrap;
}

.tiles > * {
  margin: 5px;
}
</style>
