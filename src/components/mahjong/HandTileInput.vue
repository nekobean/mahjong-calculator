<template>
  <b-table-simple class="table">
    <b-tbody>
      <!-- 萬子 -->
      <b-tr>
        <b-td class="tiles">
          <TileButton
            @click-tile="add_tile"
            v-for="tile in ManzuTiles"
            :key="tile"
            :tile="tile"
            :disabled="disabled(tile)"
          />
          <TileButton
            @click-tile="add_tile"
            :tile="Tile.AkaManzu5"
            :disabled="disabled(Tile.AkaManzu5)"
          />
        </b-td>
      </b-tr>
      <!-- 筒子 -->
      <b-tr>
        <b-td class="tiles">
          <TileButton
            @click-tile="add_tile"
            v-for="tile in PinzuTiles"
            :key="tile"
            :tile="tile"
            :disabled="disabled(tile)"
          />
          <TileButton
            @click-tile="add_tile"
            :tile="Tile.AkaPinzu5"
            :disabled="disabled(Tile.AkaPinzu5)"
          />
        </b-td>
      </b-tr>
      <!-- 索子 -->
      <b-tr>
        <b-td class="tiles">
          <TileButton
            @click-tile="add_tile"
            v-for="tile in SozuTiles"
            :key="tile"
            :tile="tile"
            :disabled="disabled(tile)"
          />
          <TileButton
            @click-tile="add_tile"
            :tile="Tile.AkaSozu5"
            :disabled="disabled(Tile.AkaSozu5)"
          />
        </b-td>
      </b-tr>
      <!-- 字牌 -->
      <b-tr>
        <b-td class="tiles">
          <TileButton
            @click-tile="add_tile"
            v-for="tile in ZihaiTiles"
            :key="tile"
            :tile="tile"
            :disabled="disabled(tile)"
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
} from "@/mahjong.js";
import TileButton from "./TileButton.vue";

export default {
  name: "HandTileInput",
  components: {
    TileButton,
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
      default: 0,
    },
    // ドラの枚数
    numDoraTiles: {
      type: Number,
      default: 0,
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
    add_tile(tile) {
      this.$emit("add-tile", tile);
    },

    // 無効にするかどうかを返す。
    disabled(tile) {
      if (this.numHandTiles)
        // 手牌入力欄の場合
        return this.numHandTiles >= 14 || this.tileCounts[tile] == 0;
      // ドラ表示牌入力欄の場合
      else return this.numDoraTiles >= 5 || this.tileCounts[tile] == 0;
    },
  },
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
