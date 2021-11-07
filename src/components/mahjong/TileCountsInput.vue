<template>
  <b-table-simple>
    <b-tbody>
      <!-- 萬子 -->
      <b-tr>
        <b-td class="tiles">
          <div v-for="tile in ManzuTiles" :key="tile" class="count-form">
            <TileImage :tile="tile" />
            <b-form-input
              v-model.number="tileCounts[tile]"
              type="number"
              min="0"
              :max="usedTileCounts[tile]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
          <div class="count-form">
            <TileImage :tile="Tile.AkaManzu5" />
            <b-form-input
              v-model.number="tileCounts[Tile.AkaManzu5]"
              type="number"
              min="0"
              :max="usedTileCounts[Tile.AkaManzu5]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
        </b-td>
      </b-tr>
      <!-- 筒子 -->
      <b-tr>
        <b-td class="tiles">
          <div v-for="tile in PinzuTiles" :key="tile" class="count-form">
            <TileImage :tile="tile" />
            <b-form-input
              v-model.number="tileCounts[tile]"
              type="number"
              min="0"
              :max="usedTileCounts[tile]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
          <div class="count-form">
            <TileImage :tile="Tile.AkaPinzu5" />
            <b-form-input
              v-model.number="tileCounts[Tile.AkaPinzu5]"
              type="number"
              min="0"
              :max="usedTileCounts[Tile.AkaPinzu5]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
        </b-td>
      </b-tr>
      <!-- 索子 -->
      <b-tr>
        <b-td class="tiles">
          <div v-for="tile in SozuTiles" :key="tile" class="count-form">
            <TileImage :tile="tile" />
            <b-form-input
              v-model.number="tileCounts[tile]"
              type="number"
              min="0"
              :max="usedTileCounts[tile]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
          <div class="count-form">
            <TileImage :tile="Tile.AkaSozu5" />
            <b-form-input
              v-model.number="tileCounts[Tile.AkaSozu5]"
              type="number"
              min="0"
              :max="usedTileCounts[Tile.AkaSozu5]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
        </b-td>
      </b-tr>
      <!-- 字牌 -->
      <b-tr>
        <b-td class="tiles">
          <div v-for="tile in ZihaiTiles" :key="tile" class="count-form">
            <TileImage :tile="tile" />
            <b-form-input
              v-model.number="tileCounts[tile]"
              type="number"
              min="0"
              :max="usedTileCounts[tile]"
              size="sm"
              style="max-width: 50px"
            ></b-form-input>
          </div>
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
import TileImage from "./TileImage.vue";

export default {
  name: "tileCounts",
  components: { TileImage },
  data: function () {
    return {
      Tile: Tile,
      ManzuTiles: ManzuTiles,
      PinzuTiles: PinzuTiles,
      SozuTiles: SozuTiles,
      ZihaiTiles: ZihaiTiles,
    };
  },
  props: {
    // 残り枚数の上限
    usedTileCounts: {
      type: Array,
      required: true,
    },
    // 残り枚数
    tileCounts: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.tiles {
  display: flex;
  flex-wrap: wrap;
}

.count-form {
  text-align: center;
}
</style>
