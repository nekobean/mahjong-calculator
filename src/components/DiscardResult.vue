<template>
  <div>
    <b-row class="p-2">
      <b-col>計算時間: 300ms</b-col>
    </b-row>
    <b-row class="p-2">
      <b-col>向聴数: 2向聴</b-col>
    </b-row>
    <b-row>
      <b-col>
        <!-- 結果 -->
        <b-table-simple class="table" v-if="result">
          <b-thead>
            <b-tr>
              <b-th>打牌</b-th>
              <b-th>受け入れ枚数</b-th>
              <b-th>有効牌</b-th>
              <b-th>期待値</b-th>
              <b-th>聴牌確率</b-th>
              <b-th>和了り確率</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="i in 5" :key="i">
              <b-td>
                <TileImage :tile="1" />
              </b-td>
              <b-td> 28枚 </b-td>
              <b-td class="yukohai">
                <TileImage :tile="1" />
                <TileImage :tile="2" />
                <TileImage :tile="3" />
                <TileImage :tile="4" />
                <TileImage :tile="5" />
                <TileImage :tile="6" />
              </b-td>
              <b-td> 2890点 </b-td>
              <b-td>28%</b-td>
              <b-td>32%</b-td>
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
  name: "DiscardResult",
  components: {
    TileImage,
  },
  props: ["result"],
};
</script>

<style scoped>
.yukohai {
  display: flex;
  flex-wrap: wrap;
}
</style>
