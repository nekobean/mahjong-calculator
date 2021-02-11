<template>
  <div>
    <template v-if="result && result.success">
      <!-- <pre>{{ copy_result }}</pre> -->
      <b-row class="p-2">
        <b-col
          >計算時間: {{ calc_time }}, {{ syanten }}
          <span style="color: red;"
            >※ 青色は向聴戻しとなる打牌です。</span
          ></b-col
        >
      </b-row>
      <b-row>
        <b-col>
          <!--
          手牌が14枚の場合
         -->
          <b-table
            :items="items"
            :fields="fields"
            :sort-compare="sortCompare"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
          >
            <!-- 打牌 -->
            <template #cell(tile)="data">
              <TileImage :tile="data.item.tile" />
            </template>
            <!-- 打牌 -->
            <template #cell(n_required_tiles)="data">
              {{ data.item.required_tiles.length }}種{{
                data.item.n_required_tiles
              }}枚
            </template>
            <!-- 打牌 -->
            <template #cell(required_tiles)="data">
              <TileImage
                v-for="(tile, j) in data.item.required_tiles"
                :key="j"
                :tile="tile.tile"
              />
            </template>
          </b-table>
        </b-col>
      </b-row>

      <!-- ボタン -->
      <b-row class="mb-3">
        <b-col cols="auto">
          <b-button block variant="primary" v-clipboard:copy="copy_result"
            >テキスト形式で結果をコピー</b-button
          >
        </b-col>
      </b-row>
    </template>
    <b-alert
      v-else-if="result && !result.success"
      show
      variant="danger"
      dismissible
      >{{ result.err_msg }}
    </b-alert>
  </div>
</template>

<script>
/*eslint-disable */
import TileImage from "@/components/mahjong/TileImage.vue";
import {
  Tile,
  TileOrder,
  TilePriority,
  Tile2String,
  SyantenType,
  SyantenType2String,
  Tile2MPSString,
  hand2string,
  meld2string
} from "@/mahjong.js";

export default {
  name: "Result",
  components: {
    TileImage
  },

  data() {
    return {
      sortBy: "tile",
      sortDesc: false
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
    }
  },
  computed: {
    fields() {
      if (!this.result || !this.result.success) return [];

      let syanten = this.result.response.syanten;
      let result_type = this.result.response.result_type;

      if (result_type == 1) {
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
            thStyle: "width: 100px;"
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

    items() {
      if (!this.result || !this.result.success) return [];

      let turn = this.result.request.turn;
      let syanten = this.result.response.syanten;
      let result_type = this.result.response.result_type;
      let maximie_win_prob = this.result.request.flag & 64;
      let items = [];

      if (result_type == 1) {
        for (let candidate of this.result.response.candidates) {
          // 有効牌の合計枚数
          let n_required_tiles = candidate.required_tiles.reduce(
            (s, e) => s + e.count,
            0
          );
          // 有効牌の一覧
          let required_tiles = candidate.required_tiles
            .concat()
            .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

          let item = {};

          item.tile = candidate.tile;
          if (candidate.syanten_down) {
            item._cellVariants = { tile: "info" };
          }
          item.n_required_tiles = n_required_tiles;
          item.required_tiles = required_tiles;

          if (syanten <= 3) {
            // 現状の巡目の期待値
            item.exp_value = candidate.exp_values[turn - 1];
            // 現状の巡目の和了確率
            item.win_prob = candidate.win_probs[turn - 1];
            // 現状の巡目の聴牌確率
            item.tenpai_prob = candidate.tenpai_probs[turn - 1];

            this.sortBy = maximie_win_prob ? "win_prob" : "exp_value";
            this.sortDesc = true;
          } else {
            this.sortBy = "n_required_tiles";
            this.sortDesc = true;
          }

          items.push(item);
        }
      } else {
        // 有効牌の合計枚数
        let n_required_tiles = this.result.response.required_tiles.reduce(
          (s, e) => s + e.count,
          0
        );
        // 有効牌の一覧
        let required_tiles = this.result.response.required_tiles
          .concat()
          .sort((a, b) => TileOrder[a.tile] - TileOrder[b.tile]);

        items.push({
          n_required_tiles: n_required_tiles,
          required_tiles: required_tiles
        });
      }

      return items;
    },

    syanten() {
      if (!this.result || !this.result.success) return "";

      let syanten = this.result.response.syanten;

      return syanten > 0 ? `${syanten}向聴` : "聴牌";
    },

    calc_time() {
      if (!this.result) return "";

      if (this.result.response.time.toString().length > 3)
        return Math.floor(this.result.response.time / 1000).toString() + "ms";
      else return this.result.response.time.toString() + "μs";
    },

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

      str += `手牌: ${hand2string(req.hand_tiles)}`;
      if (req.melded_blocks.length) {
        str += " " + req.melded_blocks.map(meld2string).join("");
      }
      str += ` (${res.syanten}向聴)\n\n`;

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
          str += `有効牌: [${hand2string(required_tiles.map(x => x.tile))}]`;
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

      str += `Powered by 何切るシミュレーター (https://pystyle.info/apps/nanikiru-simulator)\n`;

      return str;
    }
  },
  props: ["result"]
};
</script>

<style scoped>
.yukohai {
  display: flex;
  flex-wrap: wrap;
}
</style>
