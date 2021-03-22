<template>
  <b-container fluid class="border border-gray p-3">
    <!-- 成功時 -->
    <template v-if="result && result.success">
      <!-- 結果の概要 -->
      <b-row>
        <b-col>
          計算時間: {{ calcTime }} 向聴数: {{ syanten }}
          <br />
          <span class="text-primary">
            ※青色は向聴戻しとなる打牌です。副露している場合、役なしの和了は点数0として計算します。
          </span>
        </b-col>
      </b-row>

      <!-- ボタン -->
      <b-row class="mt-2">
        <b-col cols="auto">
          <b-button block variant="primary" v-clipboard:copy="copy_result()"
            >クリップボードにコピー
          </b-button>
        </b-col>
      </b-row>

      <!-- 打牌一覧 -->
      <b-row class="mt-2">
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
              {{ data.item.required_tiles.length }}種
              {{ data.item.n_required_tiles }}枚
            </template>
            <!-- 有効牌 -->
            <template #cell(required_tiles)="data">
              <TileImage
                v-for="(tile, i) in data.item.required_tiles"
                :key="i"
                :tile="tile.tile"
              />
            </template>
          </b-table>
        </b-col>
      </b-row>

      <!-- グラフ -->
      <template v-if="showGraph">
        <div class="chart">
          <b-row class="mt-2">
            <b-col
              >デフォルトで上位5つの牌を表示しています。<br />
              グラフ上部の凡例をクリックすることで、表示する牌を選択できます。
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col>
              <LineChart
                :chartData="lineData"
                :options="lineOptions"
              ></LineChart>
            </b-col>
          </b-row>

          <!-- 手牌の種類 -->
          <b-form-group
            label-cols="3"
            label="描画するグラフ"
            label-for="input-line-type"
            label-align="right"
          >
            <b-form-radio-group
              id="input-line-type"
              v-model="line_type"
              :options="line_options"
              button-variant="outline-secondary"
              size="sm"
              buttons
            ></b-form-radio-group>
          </b-form-group>
        </div>
      </template>
    </template>

    <!-- 失敗時 -->
    <b-alert v-else-if="result && !result.success" show variant="danger"
      >{{ result.err_msg }}
    </b-alert>
  </b-container>
</template>

<script>
/*eslint-disable */
import TileImage from "@/components/mahjong/TileImage.vue";
import {
  TileOrder,
  TilePriority,
  Tile2String,
  SyantenType2String,
  Hand2String,
  Meld2String
} from "@/mahjong.js";
import LineChart from "@/components/LineChart.js";

export default {
  name: "Result",

  components: {
    TileImage,
    LineChart
  },

  data() {
    return {
      sortDesc: true,
      line_options: [
        {
          value: "exp_values",
          text: "期待値"
        },
        {
          value: "win_probs",
          text: "和了確率"
        },
        {
          value: "tenpai_probs",
          text: "聴牌確率"
        }
      ],
      line_type: "exp_values"
    };
  },

  methods: {
    sortCompare(
      aRow,
      bRow,
      key,
      sortDesc,
      formatter,
      compareOptions,
      compareLocale
    ) {
      const a = aRow[key];
      const b = bRow[key];

      if (key === "tile") {
        // 牌の場合
        return TileOrder[a] - TileOrder[b];
      }

      if (key === "exp_value") {
        return Math.round(a) != Math.round(b)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      if (key === "win_prob") {
        return Math.round(a * 10000) != Math.round(b * 10000)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      // デフォルト
      if (
        (typeof a === "number" && typeof b === "number") ||
        (a instanceof Date && b instanceof Date)
      ) {
        return a - b;
      } else {
        return toString(a).localeCompare(
          toString(b),
          compareLocale,
          compareOptions
        );
      }
    },

    // コピーする文字列
    copy_result() {
      if (!this.result || !this.result.success) return "";

      let req = this.result.request;
      let res = this.result.response;

      let tiles2string = tiles => {
        return tiles.map(x => Tile2String.get(x)).join(",");
      };

      // 場況
      let str = "";
      str += `## 場況\n`;
      str += `場風牌: ${Tile2String.get(req.bakaze)}, `;
      str += `自風牌: ${Tile2String.get(req.zikaze)}, `;
      str += `${req.turn}巡目, `;
      str += `手牌の種類: ${SyantenType2String.get(req.syanten_type)}, `;
      if (req.dora_tiles.length) {
        str += `ドラ: [${tiles2string(req.dora_tiles)}]`;
      }
      str += "\n";

      str += `手牌: ${Hand2String(req.hand_tiles)}`;
      if (req.melded_blocks.length) {
        str += " " + req.melded_blocks.map(Meld2String).join("");
      }
      str += ` (${this.syanten})\n\n`;

      str += `## 計算結果\n`;

      if (res.result_type == 1) {
        for (let candidate of res.candidates) {
          // 有効牌の合計枚数
          let n_required_tiles = candidate.required_tiles.reduce(
            (s, e) => s + e.count,
            0
          );
          // 有効牌の一覧
          let required_tiles = candidate.required_tiles
            .concat()
            .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

          str += `打: ${Tile2String.get(candidate.tile)}, `;
          str += `受け入れ枚数: ${required_tiles.length}種${n_required_tiles}枚, `;
          str += `有効牌: [${Hand2String(required_tiles.map(x => x.tile))}]`;
          str += candidate.syanten_down ? " 向聴戻し" : "";
          str += "\n";

          if (res.syanten <= 3) {
            let exp_value = Math.floor(candidate.exp_values[req.turn - 1]);
            let win_prob = (candidate.win_probs[req.turn - 1] * 100).toFixed(2);
            let tenpai_prob = (
              candidate.tenpai_probs[req.turn - 1] * 100
            ).toFixed(2);

            str += `    期待値: ${exp_value}点, `;
            str += `和了確率: ${win_prob}%, `;
            str += `聴牌確率: ${tenpai_prob}%\n`;
          }
          str += "\n";
        }
      } else if (res.result_type == 0) {
        // 有効牌の合計枚数
        let n_required_tiles = this.result.response.required_tiles.reduce(
          (s, e) => s + e.count,
          0
        );
        // 有効牌の一覧
        let required_tiles = this.result.response.required_tiles
          .concat()
          .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

        str += `受け入れ枚数: ${required_tiles.length}種${n_required_tiles}枚 `;
        str += `有効牌: `;
        for (let tile of res.required_tiles) str += `${tile.tile}`;
        str += "\n\n";
      }

      str += `Powered by 何切るシミュレーター https://pystyle.info/apps/mahjong-nanikiru-simulator\n`;

      return str;
    }
  },

  computed: {
    showGraph() {
      if (!this.result || !this.result.success) return false;

      let res = this.result.response;

      return res.result_type == 1 && res.syanten <= 3;
    },

    lineOptions() {
      if (!this.result || !this.result.success) return {};

      let req = this.result.request;

      let xlabel = this.line_options.find(x => x.value == this.line_type).text;

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
                content: "現在"
              }
            }
          ]
        },

        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              return tooltipItems[0].xLabel + "巡目";
            },

            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label;

              let value = tooltipItem.yLabel;

              if (value <= 1) {
                value = (value * 100).toFixed(2) + "%";
              } else {
                value = Math.round(value) + "点";
              }

              return label + ": " + value;
            }
          }
        },

        legend: {
          align: "start"
        },

        animation: false,

        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "巡目"
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: xlabel
              },

              ticks: {
                callback: function(x) {
                  // 確率は%、期待値は点を末尾に付ける。
                  return x <= 1 ? Math.round(x * 100) + "%" : x + "点";
                }
              }
            }
          ]
        }
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
        "#ffadcc"
      ];

      let res = this.result.response;
      let turns = Array.from({ length: 17 }, (_, i) => i + 1);

      let datasets = [];
      for (let [i, candidate] of res.candidates.entries()) {
        datasets.push({
          label: Tile2String.get(candidate.tile),
          data: candidate[this.line_type],
          fill: false,
          lineTension: 0,
          borderColor: colors[i],
          hidden: i >= 5
        });
      }

      return {
        labels: turns,
        datasets: datasets
      };
    },

    // 打牌一覧のヘッダー
    fields() {
      if (!this.result || !this.result.success) return [];

      let syanten = this.result.response.syanten;
      let result_type = this.result.response.result_type;

      if (result_type == 1) {
        // 打牌時
        let fields = [
          {
            key: "tile",
            label: "打牌",
            sortable: true,
            thStyle: "width: 70px;"
          },
          {
            key: "n_required_tiles",
            label: "受入枚数",
            sortable: true,
            thStyle: "width: 110px;"
          },
          {
            key: "required_tiles",
            label: "有効牌",
            sortable: false
          }
        ];

        if (syanten <= 3) {
          fields = fields.concat([
            {
              key: "exp_value",
              label: "期待値",
              sortable: true,
              thStyle: "width: 100px;",
              formatter: x => Math.floor(x) + "点"
            },
            {
              key: "win_prob",
              label: "和了確率",
              sortable: true,
              thStyle: "width: 100px;",
              formatter: x => (x * 100).toFixed(2) + "%"
            },
            {
              key: "tenpai_prob",
              label: "聴牌確率",
              sortable: true,
              thStyle: "width: 100px;",
              formatter: x => (x * 100).toFixed(2) + "%"
            }
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
            thStyle: "width: 100px;"
          },
          {
            key: "required_tiles",
            label: "有効牌",
            sortable: false
          }
        ];

        return fields;
      }
    },

    // 打牌一覧のコンテンツ
    items() {
      if (!this.result || !this.result.success) return [];

      let sumRequiredTiles = x => x.reduce((s, e) => s + e.count, 0);

      let req = this.result.request;
      let res = this.result.response;

      let items = [];
      if (res.result_type == 1) {
        for (let candidate of res.candidates) {
          // 有効牌をソートする。
          let required_tiles = candidate.required_tiles
            .concat()
            .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

          let item = {};

          // 打牌
          item.tile = candidate.tile;

          // 向聴戻しは背景を青くする。
          if (candidate.syanten_down) item._cellVariants = { tile: "info" };

          // 受入枚数
          item.n_required_tiles = sumRequiredTiles(candidate.required_tiles);

          // 有効牌の一覧
          item.required_tiles = required_tiles;

          if (res.syanten <= 3) {
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
        item.n_required_tiles = sumRequiredTiles(res.required_tiles);

        // 有効牌の一覧
        item.required_tiles = res.required_tiles
          .concat()
          .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

        items.push(item);
      }

      return items;
    },

    // ソート方法
    sortBy() {
      if (!this.result || !this.result.success) return null;

      let req = this.result.request;
      let res = this.result.response;

      if (res.result_type == 1) {
        // 14枚
        if (res.syanten <= 3 && req.flag & 64) {
          // 「3向聴以上、和了確率最大化」の場合は和了確率が高い順にソートする。
          return "win_prob";
        } else if (res.syanten <= 3 && !(req.flag & 64)) {
          // 「3向聴以上かつ期待値最大化」の場合は期待値が高い順にソートする。
          return "exp_value";
        } else {
          // 「4向聴以上」の場合は受入枚数が多い順にソートする。
          return "n_required_tiles";
        }
      } else {
        // 13枚
        return "";
      }
    },

    // 向聴数
    syanten() {
      if (!this.result || !this.result.success) return "";

      let syanten = this.result.response.syanten;

      return syanten == 0 ? "聴牌" : `${syanten}向聴`;
    },

    // 計算時間
    calcTime() {
      if (!this.result) return "";

      let time = this.result.response.time;

      if (time.toString().length > 6) return (time / 1000000).toFixed(2) + "s";
      else if (time.toString().length > 3)
        return Math.floor(time / 1000) + "ms";
      else return time.toString() + "μs";
    }
  },

  props: ["result"],

  watch: {
    result: function(result) {
      if (!result || !result.success) return;

      let sumRequiredTiles = x => x.reduce((s, e) => s + e.count, 0);

      let req = result.request;
      let res = result.response;

      if (res.result_type != 1) return;

      if (req.flag & 64) this.line_type = "win_probs";
      else this.line_type = "exp_values";

      // 14枚
      if (res.syanten <= 3 && req.flag & 64) {
        // 「3向聴以上、和了確率最大化」の場合は和了確率が高い順にソートする。
        res.candidates.sort((a, b) =>
          Math.round(a.win_probs[0] * 10000) !=
          Math.round(b.win_probs[0] * 10000)
            ? b.win_probs[0] - a.win_probs[0]
            : TilePriority[a.tile] - TilePriority[b.tile]
        );
      } else if (res.syanten <= 3 && !(req.flag & 64)) {
        // 「3向聴以上かつ期待値最大化」の場合は期待値が高い順にソートする。
        res.candidates.sort((a, b) =>
          Math.round(a.exp_values[0]) != Math.round(b.exp_values[0])
            ? b.exp_values[0] - a.exp_values[0]
            : TilePriority[a.tile] - TilePriority[b.tile]
        );
      } else {
        // 「4向聴以上」の場合は受入枚数が多い順にソートする。
        res.candidates.sort(function(a, b) {
          let a_sum = sumRequiredTiles(a.required_tiles);
          let b_sum = sumRequiredTiles(b.required_tiles);
          return a_sum != b_sum
            ? b_sum - a_sum
            : TilePriority[a.tile] - TilePriority[b.tile];
        });
      }
    }
  }
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
