<template>
  <b-container fluid class="border border-gray">
    <!-- 成功時 -->
    <template v-if="result && result.success">
      <!-- 保存 -->
      <b-row class="mt-2" align-v="center">
        <b-col cols="2"> 結果の出力 </b-col>
        <b-col>
          <!-- 画像で保存するボタン -->
          <b-button
            v-if="!isMobile"
            class="mr-2"
            variant="primary"
            size="sm"
            @click="downloadResultAsImage"
            >画像で保存
          </b-button>

          <!-- テキストで保存するボタン -->
          <b-button
            variant="primary"
            size="sm"
            v-clipboard:copy="copyResultAsText()"
            >テキストでコピー
          </b-button>
        </b-col>
      </b-row>

      <!-- 注意 -->
      <b-row>
        <b-col>
          <span>■ 青色は向聴戻しとなる打牌です。</span>
          <span v-if="result.request.melded_blocks.length > 0">
            <br />■ 役なしの和了は点数0として計算します。
          </span>
          <span v-if="result.response.result_type == 0">
            <br />■ 手牌が13枚のため、有効牌を表示します。
          </span>
          <span
            v-if="
              result.response.result_type == 1 &&
              result.response.syanten.syanten > 3
            "
          >
            <br />■ 4向聴以上のため、有効牌のみ表示します。
          </span>
        </b-col>
      </b-row>

      <!-- 計算時間 -->
      <b-row>
        <b-col cols="2"> 計算時間 </b-col>
        <b-col>{{ calcTime }}</b-col>
      </b-row>

      <!-- 向聴数 -->
      <b-row>
        <b-col cols="2"> 向聴数 </b-col>
        <b-col>
          {{ Syanten2String(result.response.syanten.syanten) }} (一般手:
          {{ Syanten2String(result.response.syanten.normal) }} 七対子:
          {{ Syanten2String(result.response.syanten.tiitoi) }} 国士無双:
          {{ Syanten2String(result.response.syanten.kokusi) }})
        </b-col>
      </b-row>

      <!-- 打牌一覧 -->
      <b-row class="mt-2" id="result">
        <b-col>
          <b-table
            :fields="fields"
            :items="items"
            :sort-compare="sortCompare"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
          >
            <!-- 打牌 -->
            <template #cell(tile)="data">
              <TileImage :tile="data.item.tile" />
            </template>
            <!-- 受入枚数 -->
            <template #cell(n_required_tiles)="data">
              <div class="mb-2">
                {{ data.item.required_tiles.length }}種
                {{ data.item.n_required_tiles }}枚
              </div>
              <div class="yukohai">
                <TileImage
                  v-for="(tile, i) in data.item.required_tiles"
                  :key="i"
                  :tile="tile.tile"
                />
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>

      <!-- グラフ -->
      <template v-if="showGraph">
        <b-row class="mt-2">
          <b-col
            >デフォルトで上位5つの牌を表示しています。<br />
            グラフ上部の凡例をクリックすることで、表示する牌を選択できます。
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col>
            <LineChart
              class="chart"
              :chartData="lineData"
              :options="lineOptions"
            ></LineChart>
          </b-col>
        </b-row>

        <!-- 手牌の種類 -->
        <b-row>
          <b-col>
            <b-form-group
              label-cols="3"
              label="描画するグラフ"
              label-for="input-line-type"
              label-align="right"
            >
              <b-form-radio-group
                id="input-line-type"
                v-model="lineType"
                :options="line_options"
                button-variant="outline-secondary"
                buttons
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
      </template>
    </template>

    <!-- 失敗時 -->
    <b-row v-else-if="result && !result.success">
      <b-col
        ><b-alert show variant="danger">{{ result.err_msg }} </b-alert></b-col
      >
    </b-row>
  </b-container>
</template>

<script>
import { isMobile } from "mobile-device-detect";
import html2canvas from "html2canvas";
import TileImage from "@/components/mahjong/TileImage.vue";
import {
  TileOrder,
  TilePriority,
  Tile2String,
  Hand2String,
  Problem2String,
  Syanten2String,
} from "@/mahjong.js";
import LineChart from "@/components/LineChart.js";

export default {
  name: "Result",
  components: {
    TileImage,
    LineChart,
  },
  props: ["result"],
  data() {
    return {
      isMobile: isMobile,
      sortDesc: true,
      sortBy: "",
      line_options: [
        {
          value: "exp_values",
          text: "期待値",
        },
        {
          value: "win_probs",
          text: "和了確率",
        },
        {
          value: "tenpai_probs",
          text: "聴牌確率",
        },
      ],
      lineType: "exp_values",
      Syanten2String: Syanten2String,
    };
  },

  methods: {
    // 画像でダウンロードする。
    downloadResultAsImage() {
      let target = document.querySelector("#result");
      let config = { useCORS: true };
      let req = this.result.request;

      html2canvas(target, config).then((canvas) => {
        var a = document.createElement("a");
        a.href = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        a.download = `${Hand2String(req.hand_tiles, req.melded_blocks)}.png`;
        a.click();
      });
    },

    // テキストでコピーする。
    copyResultAsText() {
      let req = this.result.request;
      let res = this.result.response;

      // 場況
      let str = "";
      str += `## 場況\n`;
      str += Problem2String(
        req.bakaze,
        req.zikaze,
        req.turn,
        req.dora_indicators,
        req.hand_tiles,
        req.melded_blocks
      );
      str += ` ${Syanten2String(res.syanten.syanten)}\n\n`;

      str += `## 計算結果\n`;

      if (res.result_type == 1) {
        for (let candidate of res.candidates) {
          // 有効牌の合計枚数
          let n_required_tiles = this.sumRequiredTiles(
            candidate.required_tiles
          );

          str += `打: ${Tile2String.get(candidate.tile)}, `;
          str += `受入枚数: ${candidate.required_tiles.length}種${n_required_tiles}枚, `;
          str += `有効牌: ${Hand2String(
            candidate.required_tiles.map((x) => x.tile)
          )}`;
          str += candidate.syanten_down ? " (向聴戻し)" : "";
          str += "\n";

          if (this.isProbCalculated) {
            let exp_value = candidate.exp_values[req.turn - 1].toFixed(0);
            let win_prob = (candidate.win_probs[req.turn - 1] * 100).toFixed(2);
            let tenpai_prob = (
              candidate.tenpai_probs[req.turn - 1] * 100
            ).toFixed(2);

            str += `期待値: ${exp_value}点, `;
            str += `和了確率: ${win_prob}%, `;
            str += `聴牌確率: ${tenpai_prob}%\n`;
          }
          str += "\n";
        }
      } else if (res.result_type == 0) {
        // 受入枚数
        let n_required_tiles = this.sumRequiredTiles(res.required_tiles);

        str += `受入枚数: ${res.required_tiles.length}種${n_required_tiles}枚 `;
        str += `有効牌: ${Hand2String(res.required_tiles.map((x) => x.tile))}`;
        str += "\n\n";
      }

      str += `Powered by 何切るシミュレーター https://pystyle.info/apps/mahjong-nanikiru-simulator/\n`;

      return str;
    },

    // 比較方法
    sortCompare(aRow, bRow, key) {
      let a = aRow[key];
      let b = bRow[key];

      if (key === "tile") {
        // 牌の場合
        return TileOrder[a] - TileOrder[b];
      }

      if (key === "exp_value") {
        return Math.floor(a) != Math.floor(b)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      if (key === "win_prob" || key === "tenpai_prob") {
        return Math.floor(a * 10000) != Math.floor(b * 10000)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      if (key === "n_required_tiles") {
        // 向聴戻しは最後にする。
        if (!aRow.syanten_down) a += 1000;
        if (!bRow.syanten_down) b += 1000;
        return a - b;
      }

      return null;
    },

    // ソートする項目を設定する。
    setSortBy() {
      if (!this.result || !this.result.success) {
        this.sortDesc = true;
        this.sortBy = "";
        return;
      }

      let res = this.result.response;

      this.sortDesc = true;
      if (res.result_type == 1) {
        // 14枚
        if (this.isProbCalculated && this.maximizeWinProb) {
          // 「3向聴以上、和了確率最大化」の場合は和了確率が高い順にソートする。
          this.sortBy = "win_prob";
          this.lineType = "win_probs";
        } else if (this.isProbCalculated && !this.maximizeWinProb) {
          // 「3向聴以上かつ期待値最大化」の場合は期待値が高い順にソートする。
          this.sortBy = "exp_value";
          this.lineType = "exp_values";
        } else {
          // 「4向聴以上」の場合は受入枚数が多い順にソートする。
          this.sortBy = "n_required_tiles";
        }
      } else {
        this.sortBy = "";
      }
    },

    // 有効牌の合計枚数を数える。
    sumRequiredTiles(required_tiles) {
      return required_tiles.reduce((s, e) => s + e.count, 0);
    },
  },
  computed: {
    showGraph() {
      if (!this.result || !this.result.success) return false;

      let res = this.result.response;
      return res.result_type == 1 && this.isProbCalculated;
    },

    lineOptions() {
      if (!this.result || !this.result.success) return {};

      let req = this.result.request;

      let xlabel = this.line_options.find((x) => x.value == this.lineType).text;

      let options = {
        annotation: {
          annotations: [
            {
              type: "line",
              id: "vLine",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: req.turn,
              borderWidth: 2,
              borderColor: "darkred",
              borderDash: [2, 2],
              label: {
                enabled: true,
                position: "top",
                content: "現在",
              },
            },
          ],
        },

        tooltips: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].xLabel + "巡目";
            },

            label: function (tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label;

              let value = tooltipItem.yLabel;

              if (value <= 1) {
                value = (value * 100).toFixed(2) + "%";
              } else {
                value = Math.round(value) + "点";
              }

              return label + ": " + value;
            },
          },
        },

        legend: {
          align: "start",
        },

        animation: false,

        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "巡目",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xlabel,
              },

              ticks: {
                callback: function (x) {
                  // 確率は%、期待値は点を末尾に付ける。
                  return x <= 1 ? Math.round(x * 100) + "%" : x + "点";
                },
              },
            },
          ],
        },
      };

      return options;
    },

    lineData() {
      if (!this.result || !this.result.success) return {};

      let colors = [
        "#e351d1",
        "#00973d",
        "#646df8",
        "#f1bf4b",
        "#104db2",
        "#ef7310",
        "#d199ff",
        "#7f7400",
        "#c50057",
        "#86d7ab",
        "#a11d28",
        "#705685",
        "#6c4d23",
        "#ffadcc",
      ];

      let res = this.result.response;
      let turns = Array.from({ length: 17 }, (_, i) => i + 1);

      let datasets = [];
      for (let [i, candidate] of res.candidates.entries()) {
        datasets.push({
          label: Tile2String.get(candidate.tile),
          data: candidate[this.lineType],
          fill: false,
          lineTension: 0,
          borderColor: colors[i],
          hidden: i >= 5,
        });
      }

      return {
        labels: turns,
        datasets: datasets,
      };
    },

    // 打牌一覧のヘッダー
    fields() {
      if (!this.result || !this.result.success) return [];
      let res = this.result.response;

      if (res.result_type == 1) {
        // 打牌時
        let fields = [
          {
            key: "tile",
            label: "打牌",
            sortable: true,
            thStyle: "width: 70px;",
          },
          {
            key: "n_required_tiles",
            label: "受入枚数",
            sortable: true,
          },
        ];

        if (this.isProbCalculated) {
          fields = fields.concat([
            {
              key: "exp_value",
              label: "期待値",
              sortable: true,
              thStyle: "width: 90px;",
              formatter: (x) => x.toFixed(0) + "点",
            },
            {
              key: "win_prob",
              label: "和了確率",
              sortable: true,
              thStyle: "width: 100px;",
              formatter: (x) => (x * 100).toFixed(2) + "%",
            },
            {
              key: "tenpai_prob",
              label: "聴牌確率",
              sortable: true,
              thStyle: "width: 100px;",
              formatter: (x) => (x * 100).toFixed(2) + "%",
            },
          ]);
        }

        return fields;
      } else {
        // 自摸時
        let fields = [
          {
            key: "n_required_tiles",
            label: "受入枚数",
            sortable: false,
            thStyle: "width: 100px;",
          },
          {
            key: "required_tiles",
            label: "有効牌",
            sortable: false,
          },
        ];

        return fields;
      }
    },

    // 打牌一覧のコンテンツ
    items() {
      if (!this.result || !this.result.success) return [];
      let req = this.result.request;
      let res = this.result.response;

      let items = [];
      if (res.result_type == 1) {
        for (let candidate of res.candidates) {
          let item = {};

          // 打牌
          item.tile = candidate.tile;

          // 向聴戻しは背景を青くする。
          if (candidate.syanten_down) item._cellVariants = { tile: "info" };

          item.syanten_down = candidate.syanten_down;

          // 受入枚数
          item.n_required_tiles = this.sumRequiredTiles(
            candidate.required_tiles
          );

          // 有効牌の一覧
          item.required_tiles = candidate.required_tiles;

          if (this.isProbCalculated) {
            // 現状の巡目の期待値
            item.exp_value = candidate.exp_values[req.turn - 1];
            // 現状の巡目の和了確率
            item.win_prob = candidate.win_probs[req.turn - 1];
            // 現状の巡目の聴牌確率
            item.tenpai_prob = candidate.tenpai_probs[req.turn - 1];
          }

          items.push(item);
        }
      } else {
        let item = {};

        // 受入枚数
        item.n_required_tiles = this.sumRequiredTiles(res.required_tiles);

        // 有効牌の一覧
        item.required_tiles = res.required_tiles;

        items.push(item);
      }

      return items;
    },

    // 和了確率を最大化したかどうか
    maximizeWinProb() {
      if (!this.result || !this.result.success) return false;
      let req = this.result.request;

      return req.flag & 128;
    },

    // 確率が計算されているかどうか
    isProbCalculated() {
      if (!this.result || !this.result.success) return false;
      let res = this.result.response;

      return res.result_type == 1 && res.syanten.syanten <= 3;
    },

    // 計算時間
    calcTime() {
      if (!this.result || !this.result.success) return "";

      let time = this.result.response.time;
      if (time.toString().length > 6) return (time / 1000000).toFixed(2) + "s";
      else if (time.toString().length > 3)
        return Math.floor(time / 1000) + "ms";
      else return time.toString() + "us";
    },
  },
  watch: {
    result: function (result) {
      if (!result || !result.success) return;

      this.setSortBy();

      let res = result.response;

      if (res.result_type != 1) return;

      // 14枚
      if (this.isProbCalculated && this.maximizeWinProb) {
        // 「3向聴以下かつ和了確率最大化」の場合は和了確率が高い順にソートする。
        res.candidates.sort((a, b) =>
          Math.floor(a.win_probs[0] * 10000) !=
          Math.floor(b.win_probs[0] * 10000)
            ? b.win_probs[0] - a.win_probs[0]
            : TilePriority[a.tile] - TilePriority[b.tile]
        );
      } else if (this.isProbCalculated && !this.maximizeWinProb) {
        // 「3向聴以下かつ期待値最大化」の場合は期待値が高い順にソートする。
        res.candidates.sort((a, b) =>
          Math.floor(a.exp_values[0]) != Math.floor(b.exp_values[0])
            ? b.exp_values[0] - a.exp_values[0]
            : TilePriority[a.tile] - TilePriority[b.tile]
        );
      } else {
        let sumRequiredTiles = this.sumRequiredTiles;
        // 「4向聴以上」の場合は受入枚数が多い順にソートする。
        res.candidates.sort(function (a, b) {
          let a_sum = sumRequiredTiles(a.required_tiles);
          let b_sum = sumRequiredTiles(b.required_tiles);

          if (!a.syanten_down) a_sum += 1000;
          if (!b.syanten_down) b_sum += 1000;

          return a_sum != b_sum
            ? b_sum - a_sum
            : TilePriority[a.tile] - TilePriority[b.tile];
        });
      }
    },
  },
};
</script>

<style scoped>
.yukohai {
  display: flex;
  flex-wrap: wrap;
}

.chart {
  max-width: 600px;
}
</style>
