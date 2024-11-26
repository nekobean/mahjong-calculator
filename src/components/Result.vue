<template>
  <b-container fluid class="border border-gray">
    <!-- Error -->
    <b-row v-if="result?.success === false">
      <b-col
        ><b-alert show variant="danger">{{ result.err_msg }}</b-alert></b-col
      >
    </b-row>

    <!-- Success -->
    <template v-else-if="result?.success === true">
      <b-row class="mt-2 mb-2" align-v="center">
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
          <!-- <pre>{{ copyResultAsText() }}</pre> -->
        </b-col>
      </b-row>

      <!-- Infomation -->
      <b-row>
        <b-col cols="2"> mpsz 表記 </b-col>
        <b-col>{{ problemString }}</b-col>
      </b-row>
      <b-row>
        <b-col cols="2"> 自摸数 </b-col>
        <b-col>{{ result.response.config.t_max - turn + 1 }}回</b-col>
      </b-row>
      <b-row>
        <b-col cols="2"> 山の枚数 </b-col>
        <b-col>{{ result.response.config.sum }}</b-col>
      </b-row>
      <b-col>
        <span v-if="!result.response.config.calc_stats">
          4向聴以上のため、有効牌のみ表示します。
        </span>
      </b-col>
      <b-row>
        <b-col cols="2"> 向聴数 </b-col>
        <b-col>
          {{ formatShanten(result.response.shanten.all) }} (一般形:
          {{ formatShanten(result.response.shanten.regular) }}, 七対子:
          {{ formatShanten(result.response.shanten.seven_pairs) }}, 国士無双:
          {{ formatShanten(result.response.shanten.thirteen_orphans) }})</b-col
        >
      </b-row>
      <b-row>
        <b-col cols="2"> 探索した手牌 </b-col>
        <b-col>{{ result.response.searched }}手</b-col>
      </b-row>
      <b-row>
        <b-col cols="2"> 計算時間 </b-col>
        <b-col>{{ formatTime(result.response.time) }}</b-col>
      </b-row>

      <!-- hand and melds -->
      <div id="result">
        <div class="ml-2 mt-3 mb-2">
          <b-row>
            <b-col
              ><div class="h6">
                Powered by 麻雀何切るシミュレーター ver 0.9.2
                (https://pystyle.info/apps/mahjong-nanikiru-simulator/)
              </div></b-col
            >
          </b-row>
          <b-row class="mb-3">
            <b-col cols="auto">
              <b-container id="problem" class="ml-0 p-2">
                <b-row>
                  <b-col>
                    <ul>
                      <li>
                        {{ Tile2String.get(result.request.round_wind) }}一局
                      </li>
                      <li class="ml-2">0本場</li>
                      <li class="ml-3">
                        {{ Tile2String.get(result.request.seat_wind) }}家
                      </li>
                      <li class="ml-3">{{ turn }}巡目</li>
                      <li class="ml-3">
                        <DoraTiles
                          :DoraIndicators="result.request.dora_indicators"
                          :show_only="true"
                        />
                      </li>
                    </ul>
                  </b-col>
                </b-row>
                <b-row class="mt-3">
                  <b-col>
                    <HandAndMeldedBlocks
                      :hand="result.request.hand"
                      :melds="result.request.melds"
                      :show_only="true"
                    />
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
          </b-row>

          <!-- Stats -->
          <b-row class="mt-2">
            <b-col>
              <b-table
                :fields="fields"
                :items="items"
                :sort-compare="sortCompare"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                sort-icon-left
              >
                <!-- tile -->
                <template #cell(tile)="data">
                  <TileImage :tile="data.item.tile" />
                </template>
                <!-- necessary tiles -->
                <template #cell(sum_necessary_tiles)="data">
                  <div class="mb-2">
                    {{ data.item.necessary_tiles.length }}種{{
                      data.item.sum_necessary_tiles
                    }}枚
                    <span
                      v-if="data.item.shanten != result.response.shanten.all"
                      style="color: darkblue"
                    >
                      (向聴戻し)</span
                    >
                  </div>
                  <div class="yukohai">
                    <TileImage
                      v-for="(tile, i) in data.item.necessary_tiles"
                      :key="i"
                      :tile="tile.tile"
                    />
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </div>
      </div>

      <!-- Graph -->
      <template v-if="result.response.config.calc_stats">
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
              :options="lineOptions"
              :chartData="lineData"
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

        <!-- Graph end -->
      </template>
    </template>
  </b-container>
</template>

<script>
import { isMobile } from "mobile-device-detect";
import html2canvas from "html2canvas";
import TileImage from "@/components/mahjong/TileImage.vue";
import HandAndMeldedBlocks from "@/components/mahjong/HandAndMeldedBlocks.vue";
import DoraTiles from "@/components/mahjong/DoraTiles.vue";
import {
  TileOrder,
  TilePriority,
  Tile2String,
  Hand2String,
  Problem2String,
} from "@/mahjong.js";
import LineChart from "@/components/LineChart.js";

export default {
  name: "Result",
  components: {
    TileImage,
    DoraTiles,
    HandAndMeldedBlocks,
    LineChart,
  },
  props: ["result", "turn"],
  data() {
    return {
      isMobile: isMobile,
      sortDesc: true,
      sortBy: "",
      Tile2String: Tile2String,
      Problem2String: Problem2String,
      line_options: [
        {
          value: "exp_score",
          text: "期待値",
        },
        {
          value: "win_prob",
          text: "和了確率",
        },
        {
          value: "tenpai_prob",
          text: "聴牌確率",
        },
      ],
      lineType: "exp_score",
    };
  },

  methods: {
    // マイクロ秒を人間が読みやすい形式に変換する。
    formatTime(time_us) {
      if (time_us < 1000) {
        return `${time_us}μs`;
      } else if (time_us < 1000000) {
        return `${(time_us / 1000).toFixed(2)}ms`;
      } else {
        return `${(time_us / 1000000).toFixed(2)}s`;
      }
    },

    formatShanten(shanten) {
      if (shanten == -1) return "和了";
      else if (shanten == 0) return "聴牌";

      return `${shanten}向聴`;
    },

    // 画像でダウンロードする。
    downloadResultAsImage() {
      const target = document.querySelector("#result");
      const config = { useCORS: true };
      const req = this.result.request;

      html2canvas(target, config).then((canvas) => {
        var a = document.createElement("a");
        a.href = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        a.download = `${Hand2String(req.hand, req.melds)}.png`;
        a.click();
      });
    },

    // テキストでコピーする。
    copyResultAsText() {
      const req = this.result.request;
      const res = this.result.response;

      // 場況
      let str = "";
      str += `## 場況\n`;
      str +=
        Problem2String(
          req.round_wind,
          req.seat_wind,
          this.turn,
          req.dora_indicators,
          req.hand,
          req.melds
        ) + "\n";

      str +=
        `${this.formatShanten(res.shanten.all)} ` +
        `(一般形: ${this.formatShanten(res.shanten.all)} ` +
        `七対子: ${this.formatShanten(res.shanten.seven_pairs)} ` +
        `国士無双: ${this.formatShanten(res.shanten.thirteen_orphans)})\n\n`;

      str += `## 計算結果\n`;

      for (let stat of res.stats) {
        const sum = stat.necessary_tiles.reduce((a, c) => a + c.count, 0);
        if (res.config.num_tiles == 14) {
          str += `打: ${Tile2String.get(stat.tile)}, `;
        }
        str += `有効牌: ${stat.necessary_tiles.length}種${sum}枚, `;
        str += `${Hand2String(stat.necessary_tiles.map((x) => x.tile))}`;
        str += (stat.shanten != res.shanten.all ? " (向聴戻し)" : "") + "\n";
        if (res.config.calc_stats) {
          const exp_score = stat.exp_score[this.turn].toFixed(0);
          const win_prob = (stat.win_prob[this.turn] * 100).toFixed(2);
          const tenpai_prob = (stat.tenpai_prob[this.turn] * 100).toFixed(2);
          str += `期待値: ${exp_score}点, `;
          str += `和了確率: ${win_prob}%, `;
          str += `聴牌確率: ${tenpai_prob}%`;
        }
        str += "\n";
      }
      str += "\n";
      str += `Powered by 何切るシミュレーター https://pystyle.info/apps/mahjong-nanikiru-simulator/\n`;

      return str;
    },

    sortCompare(aRow, bRow, key) {
      const a = aRow[key];
      const b = bRow[key];

      if (key === "tile") {
        return TileOrder[a] - TileOrder[b];
      }

      if (key === "exp_score") {
        return Math.floor(a) != Math.floor(b)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      if (key === "win_prob" || key === "tenpai_prob") {
        return Math.floor(a * 10000) != Math.floor(b * 10000)
          ? a - b
          : TilePriority[bRow["tile"]] - TilePriority[aRow["tile"]];
      }

      if (key === "sum_necessary_tiles") {
        return aRow.shanten != bRow.shanten
          ? bRow.shanten - aRow.shanten
          : a - b;
      }

      return null;
    },
  },

  computed: {
    problemString() {
      if (this.result?.success !== true) {
        return [];
      }

      return Problem2String(
        this.result.request.round_wind,
        this.result.request.seat_wind,
        this.turn,
        this.result.request.dora_indicators,
        this.result.request.hand,
        this.result.request.melds
      );
    },

    fields() {
      if (this.result?.success !== true) {
        return [];
      }

      const fields = [];
      const res = this.result.response;

      if (res.config.num_tiles == 14) {
        fields.push({
          key: "tile",
          label: "打牌",
          sortable: true,
          thStyle: "width: 70px;",
        });
      }

      fields.push({
        key: "sum_necessary_tiles",
        label: "有効牌",
        sortable: true,
      });

      if (res.config.calc_stats) {
        fields.push(
          {
            key: "exp_score",
            label: "期待値",
            sortable: true,
            thStyle: "width: 100px;",
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
          }
        );
      }

      return fields;
    },

    items() {
      if (this.result?.success !== true) {
        return [];
      }

      const res = this.result.response;
      const items = [];
      for (const stat of res.stats) {
        let item = {};
        item.tile = stat.tile;
        item.necessary_tiles = stat.necessary_tiles;
        item.sum_necessary_tiles = stat.necessary_tiles.reduce(
          (a, c) => a + c.count,
          0
        );
        item.shanten = stat.shanten;
        if (res.config.calc_stats) {
          item.exp_score = stat.exp_score[this.turn];
          item.win_prob = stat.win_prob[this.turn];
          item.tenpai_prob = stat.tenpai_prob[this.turn];
        }

        items.push(item);
      }

      return items;
    },

    lineOptions() {
      if (this.result?.success !== true) {
        return {};
      }

      const xlabel = this.line_options.find(
        (x) => x.value == this.lineType
      ).text;
      const options = {
        annotation: {
          annotations: [
            {
              type: "line",
              id: "vLine",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: this.turn,
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
      if (this.result?.success !== true) {
        return {};
      }

      if (!this.result.response.config.calc_stats) {
        return {};
      }

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
      const res = this.result.response;

      const t_min = res.config.t_min;
      const t_max = res.config.t_max;
      const turns = Array.from(
        { length: t_max - t_min + 1 },
        (_, i) => t_min + i
      );

      const stats = JSON.parse(JSON.stringify(res.stats));
      stats.sort(
        (a, b) => b[this.lineType][this.turn] - a[this.lineType][this.turn]
      );

      const datasets = [];
      for (const [i, stat] of stats.entries()) {
        const values = stat[this.lineType].slice(t_min, t_max + 1);
        const label =
          res.config.num_tiles == 14 ? Tile2String.get(stat.tile) : "値";
        datasets.push({
          label: label,
          data: values,
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
  },

  watch: {
    result: function (result) {
      if (this.result?.success !== true) {
        return;
      }

      if (this.result.response.config.calc_stats) {
        this.sortDesc = true;
        this.sortBy = "exp_score";
      } else {
        this.sortDesc = true;
        this.sortBy = "sum_necessary_tiles";
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
