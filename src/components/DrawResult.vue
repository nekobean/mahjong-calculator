<template>
  <div>
    <b-row class="p-2">
      <b-col>計算時間: 300ms</b-col>
    </b-row>
    <b-row class="p-2">
      <b-col>向聴数: 2向聴</b-col>
    </b-row>
    <b-row class="p-2">
      <b-col>受け入れ枚数: 32枚</b-col>
    </b-row>
    <b-row>
      <b-col cols="3">
        <!-- 結果 -->
        <b-table-simple class="table" v-if="result">
          <b-thead>
            <b-tr>
              <b-th>有効牌</b-th>
              <b-th>枚数</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="i in 5" :key="i">
              <b-td><TileImage :tile="1" /></b-td>
              <b-td>4枚</b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-col>
    </b-row>

    <!-- ボタン -->
    <b-row class="mb-3">
      <b-col cols="auto">
        <b-button block variant="primary">テキスト形式で結果をコピー</b-button>
      </b-col>
    </b-row>
  </div>
</template>

 
<script>
import TileImage from "@/components/mahjong/TileImage.vue";

export default {
  name: "DrawResult",
  components: {
    TileImage,
  },
  props: ["result"],
};
</script>
