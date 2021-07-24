<template>
  <div>
    <b-container fluid class="border border-gray p-3">
      <!-- 設定入力欄 -->
      <b-row>
        <b-col>
          <!-- 場風 -->
          <b-form-group
            label-cols="2"
            content-cols="4"
            label="場風"
            label-for="input-bakaze"
            label-align="right"
          >
            <b-form-radio-group
              id="input-bakaze"
              v-model="bakaze"
              :options="input_bakaze_options"
              button-variant="outline-primary"
              size="sm"
              buttons
            ></b-form-radio-group>
          </b-form-group>

          <!-- 自風 -->
          <b-form-group
            label-cols="2"
            content-cols="4"
            label="自風"
            label-for="input-zikaze"
            label-align="right"
          >
            <b-form-radio-group
              id="input-zikaze"
              v-model="zikaze"
              :options="input_zikaze_options"
              button-variant="outline-primary"
              size="sm"
              buttons
            ></b-form-radio-group>

            <b-tooltip
              target="input-zikaze"
              triggers="hover"
              custom-class="custom-tooltip"
              placement="topright"
            >
              東家の場合は親、それ以外の場合は子として点数計算します。
            </b-tooltip>
          </b-form-group>

          <!-- 巡目 -->
          <b-form-group
            label-cols="2"
            content-cols="2"
            label="現在の巡目"
            label-for="input-turn"
            label-align="right"
          >
            <b-form-select v-model="turn" id="input-turn" size="sm">
              <b-form-select-option v-for="i in 17" :key="i" :value="i"
                >{{ i }} 巡目</b-form-select-option
              >
            </b-form-select>
          </b-form-group>

          <!-- 手牌の種類 -->
          <b-form-group
            label-cols="2"
            content-cols="4"
            label="手牌の種類"
            label-for="input-syanten-type"
            label-align="right"
          >
            <b-form-radio-group
              id="input-syanten-type"
              v-model="syanten_type"
              :options="input_syanten_type_options"
              button-variant="outline-primary"
              size="sm"
              buttons
            ></b-form-radio-group>

            <b-tooltip
              target="input-syanten-type"
              triggers="hover"
              custom-class="custom-tooltip"
              placement="topright"
            >
              手牌の種類を選択します。現在の実装では、「一般手」を選択した場合、七対子は考慮されません。
            </b-tooltip>
          </b-form-group>

          <!-- ドラ -->
          <!-- <b-form-group
            label-cols="2"
            content-cols="4"
            label="ドラ表示牌"
            label-for="input-dora-indicators"
            label-align="right"
          >
            <DoraTiles
              v-on:remove-dora="remove_dora"
              :dora_indicators="dora_indicators"
            />
          </b-form-group> -->

          <!-- 考慮する項目 -->
          <b-form-group
            label-cols="2"
            label="考慮する項目"
            label-for="input-flag"
            label-align="right"
          >
            <b-form-checkbox-group
              id="input-flag"
              v-model="flag"
              :options="input_flag_options"
              size="sm"
              switches
            ></b-form-checkbox-group>

            <b-tooltip
              target="input-flag"
              triggers="hover"
              custom-class="custom-tooltip"
              placement="topright"
            >
              <ul>
                <li>
                  向聴戻し:
                  向聴戻しの打牌も計算対象に含めるかどうかを設定します。
                </li>
                <li>
                  手変わり:
                  向聴数が変化しない手変わりも計算対象に含めるかどうかを設定します。
                </li>
                <li>
                  ダブル立直:
                  有効の場合、1巡目で聴牌の場合はダブル立直になります。
                </li>
                <li>
                  一発、海底撈月:
                  有効の場合、一発、海底撈月が点数期待値に考慮されます。
                </li>
                <li>
                  裏ドラ: 有効の場合、裏ドラが点数期待値に考慮されます。
                </li>
              </ul>
            </b-tooltip>
          </b-form-group>

          <!-- 考慮する項目 -->
          <b-form-group
            label-cols="2"
            content-cols="4"
            label="重視する項目"
            label-for="input-maximize-target"
            label-align="right"
          >
            <b-form-radio-group
              id="input-maximize-target"
              v-model="maximize_target"
              :options="input_maximize_target_options"
              button-variant="outline-primary"
              size="sm"
              buttons
            ></b-form-radio-group>

            <b-tooltip
              target="input-maximize-target"
              triggers="hover"
              custom-class="custom-tooltip"
              placement="topright"
            >
              一向聴以上の手牌の場合に、シミュレーション途中の打牌選択の方針を設定します。

              <ul>
                <li>
                  期待値最大化: 期待値が最大となる打牌を選択します。
                </li>
                <li>
                  和了確率最大化:
                  和了確率が最大となる打牌を選択します。オーラストップなど和了率を重視する場合はこちらを選択してください。
                </li>
              </ul>
            </b-tooltip>
          </b-form-group>

          <!-- 牌の枚数 -->
          <!-- <b-form-group
            label-cols="2"
            content-cols="2"
            label="牌の枚数"
            label-for="input-n-hand-tiles"
            label-align="right"
          >
            <b-form-input
              v-model="n_hand_tiles"
              id="input-n-hand-tiles"
              size="sm"
              :readonly="true"
            ></b-form-input>
          </b-form-group> -->
        </b-col>
      </b-row>

      <!-- 手牌及び副露ブロックの一覧 -->
      <b-row class="mb-3">
        <b-col cols="auto">
          <b-container id="problem" class="ml-0 p-2">
            <b-row>
              <b-col>
                <ul>
                  <li>{{ Tile2String.get(bakaze) }}一局</li>
                  <li class="ml-2">0本場</li>
                  <li class="ml-3">{{ Tile2String.get(zikaze) }}家</li>
                  <li class="ml-3">{{ turn }}巡目</li>
                  <li class="ml-3">
                    <DoraTiles
                      v-on:remove-dora="remove_dora"
                      :dora_indicators="dora_indicators"
                    />
                  </li>
                </ul>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col>
                <HandAndMeldedBlocks
                  v-on:remove-tile="remove_tile"
                  v-on:remove-block="remove_meld"
                  :hand_tiles="hand_tiles"
                  :melded_blocks="melded_blocks"
                  size="sm"
                />
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>

      <!-- 手牌及び副露ブロックの入力欄 -->
      <b-row>
        <b-col>
          <b-tabs v-model="select_tab">
            <b-tab title="手牌" active>
              <HandTileInput
                v-on:add-tile="add_tile"
                :tile_counts="tile_counts"
                :n_hand_tiles="n_hand_tiles"
              />
            </b-tab>
            <b-tab title="ドラ表示牌">
              <p class="m-2">
                ドラはドラ表示牌で指定するので注意してください。槓ドラも含め、最大5枚まで設定できます。
              </p>
              <HandTileInput
                v-on:add-tile="add_dora"
                :tile_counts="tile_counts"
                :n_dora_tiles="dora_indicators.length"
              />
            </b-tab>
            <b-tab title="明刻子">
              <MinkotuInput
                v-on:add-block="add_meld"
                :tile_counts="tile_counts"
                :n_hand_tiles="n_hand_tiles"
              />
            </b-tab>
            <b-tab title="明順子">
              <MinsyuntuInput
                v-on:add-block="add_meld"
                :tile_counts="tile_counts"
                :n_hand_tiles="n_hand_tiles"
              />
            </b-tab>
            <b-tab title="明槓子">
              <MinkantuInput
                v-on:add-block="add_meld"
                :tile_counts="tile_counts"
                :n_hand_tiles="n_hand_tiles"
              />
            </b-tab>
            <b-tab title="暗槓子">
              <AnkantuInput
                v-on:add-block="add_meld"
                :tile_counts="tile_counts"
                :n_hand_tiles="n_hand_tiles"
              />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>

      <!-- ボタン -->
      <b-row class="mb-2">
        <b-col>
          <b-overlay :show="is_calculating" rounded="sm">
            <b-button
              class="mr-2"
              variant="primary"
              @click="calculate"
              :disabled="n_hand_tiles < 13 || is_calculating"
              >計算を実行
            </b-button>
            <b-button class="mr-2" variant="primary" @click="clear_hand"
              >手牌を初期化
            </b-button>
            <b-button class="mr-2" variant="primary" @click="clear_all"
              >設定を初期化
            </b-button>
            <b-button class="mr-2" variant="primary" @click="set_random_hand"
              >ランダムの手牌入力
            </b-button>

            <template #overlay>
              <b-icon
                icon="three-dots"
                animation="cylon"
                font-scale="4"
              ></b-icon>
              <p>計算中</p>
            </template>
          </b-overlay>
        </b-col>
      </b-row>

      <!-- 他ツール -->
      <b-row align-v="center" class="mb-2">
        <b-col cols="auto">
          何切る問題を作成
        </b-col>
        <b-col>
          <!-- 画像で保存するボタン -->
          <b-button
            class="mr-2"
            variant="primary"
            @click="generateImage"
            :disabled="n_hand_tiles < 13"
            >画面で保存する
          </b-button>
          <!-- テキストで保存するボタン -->
          <b-button
            variant="primary"
            v-clipboard:copy="generateText()"
            :disabled="n_hand_tiles < 13"
            >テキストでコピーする
          </b-button>
        </b-col>
      </b-row>

      <!-- 他ツール -->
      <b-row align-v="center">
        <b-col cols="auto">
          他ツールでの検証
        </b-col>
        <b-col>
          <!-- 天鳳 / 牌理 -->
          <b-button
            class="mr-2"
            :disabled="n_hand_tiles % 3 != 2"
            :href="tenhoURL"
            target="_blank"
            variant="success"
            id="tooltip-tenho-hairi"
            >天鳳 / 牌理
          </b-button>
          <!-- 一人麻雀練習機 -->
          <b-button
            class="mr-2"
            :disabled="
              n_hand_tiles != 14 ||
                this.melded_blocks != 0 ||
                this.dora_indicators.length != 1
            "
            variant="success"
            @click="downloadHMR"
            id="tooltip-hmr"
            >一人麻雀練習機
          </b-button>
          <b-tooltip
            target="tooltip-hmr"
            triggers="hover"
            custom-class="custom-tooltip"
            placement="topright"
          >
            <p>
              <b-link
                href="http://ara.moo.jp/mjhmr/"
                target="_blank"
                class="text-info"
                >一人麻雀練習機</b-link
              >で読み込める .hmr ファイルをダウンロードします。
            </p>
            <p>一人麻雀練習機は副露、赤牌、槓ドラは対応していません。</p>

            <ol>
              <li>
                一人麻雀練習機を起動します。
              </li>
              <li>
                「読み込み」ボタンをクリックし、ダウンロードした .hmr 形式の
                ファイルを開きます。
              </li>
              <li>
                メニューの「ツール」から「何切る？」または「何切る？(手変わり)」を選択します。
              </li>
            </ol>
          </b-tooltip>
          <!-- ツモアガリ確率計算機 -->
          <b-button
            :disabled="n_hand_tiles != 14 || this.melded_blocks.length != 0"
            variant="success"
            v-clipboard:copy="tumoProbStr"
            id="tooltip-tumoprob"
            >ツモアガリ確率計算機</b-button
          >
          <b-tooltip
            target="tooltip-tumoprob"
            triggers="hover"
            custom-class="custom-tooltip"
            placement="topright"
          >
            <b-link
              href="http://critter.sakura.ne.jp/agari_keisan.html"
              target="_blank"
              class="text-info"
              >ツモアガリ確率計算機</b-link
            >の「手牌」入力欄にコピペできる手牌形式をクリップボードにコピーします。
          </b-tooltip>
        </b-col>
      </b-row>
    </b-container>

    <!-- 計算結果 -->
    <Result :result="result" />
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import axios from "axios";
import {
  sort_tiles,
  Tile,
  DoraHyozi2Dora,
  Tile2String,
  Hand2String,
  SyantenType,
  SyantenType2String,
  Hand2TenhoString,
  Aka2Normal,
  Tile2TumoProbString,
  Problem2String
} from "@/mahjong.js";

import HandAndMeldedBlocks from "@/components/mahjong/HandAndMeldedBlocks.vue";
import DoraTiles from "@/components/mahjong/DoraTiles.vue";
import HandTileInput from "@/components/mahjong/HandTileInput.vue";
import MinkotuInput from "@/components/mahjong/MinkotuInput.vue";
import MinsyuntuInput from "@/components/mahjong/MinsyuntuInput.vue";
import MinkantuInput from "@/components/mahjong/MinkantuInput.vue";
import AnkantuInput from "@/components/mahjong/AnkantuInput.vue";
import Result from "./Result.vue";

export default {
  name: "Calculator",
  components: {
    HandAndMeldedBlocks,
    DoraTiles,
    HandTileInput,
    MinkotuInput,
    MinsyuntuInput,
    MinkantuInput,
    AnkantuInput,
    Result
  },
  data: function() {
    return {
      bakaze: Tile.Ton, // 場風
      zikaze: Tile.Ton, // 自風
      turn: 3, // 現在の巡目
      syanten_type: SyantenType.Normal, // 手牌の種類
      dora_indicators: [Tile.Ton], // ドラ
      flag: [1, 2, 4, 8, 16, 32], // フラグ
      maximize_target: 0,
      hand_tiles: [], // 手牌
      melded_blocks: [], // 副露ブロックの一覧
      result: null, // 結果
      is_calculating: false,
      select_tab: 0,
      Hand2String: Hand2String,
      Tile2String: Tile2String,

      // オプション
      // 場風
      input_bakaze_options: [
        { value: Tile.Ton, text: Tile2String.get(Tile.Ton) },
        { value: Tile.Nan, text: Tile2String.get(Tile.Nan) }
      ],
      // 自風
      input_zikaze_options: [
        { value: Tile.Ton, text: Tile2String.get(Tile.Ton) },
        { value: Tile.Nan, text: Tile2String.get(Tile.Nan) },
        { value: Tile.Sya, text: Tile2String.get(Tile.Sya) },
        { value: Tile.Pe, text: Tile2String.get(Tile.Pe) }
      ],
      // 手牌の種類
      input_syanten_type_options: [
        {
          value: SyantenType.Normal,
          text: SyantenType2String.get(SyantenType.Normal)
        },
        {
          value: SyantenType.Tiitoi,
          text: SyantenType2String.get(SyantenType.Tiitoi)
        },
        {
          value: SyantenType.Kokusi,
          text: SyantenType2String.get(SyantenType.Kokusi)
        }
      ],
      // 考慮する項目
      input_flag_options: [
        { value: 1, text: "向聴戻し" },
        { value: 2, text: "手変わり" },
        { value: 4, text: "ダブル立直" },
        { value: 8, text: "一発" },
        { value: 16, text: "海底自摸" },
        { value: 32, text: "裏ドラ" }
      ],
      // 重視する項目
      input_maximize_target_options: [
        {
          value: 0,
          text: "期待値最大化"
        },
        {
          value: 64,
          text: "和了確率最大化"
        }
      ]
    };
  },

  computed: {
    // 手牌の枚数
    tenhoURL: function() {
      return "https://tenhou.net/2/?q=" + Hand2TenhoString(this.hand_tiles);
    },

    // tumoProbURL: function() {
    //   // ドラは最大4枚、赤ドラは非対応
    //   let dora_tiles = this.dora_indicators
    //     .map(x => DoraHyozi2Dora[x])
    //     .slice(0, 4)
    //     .map(x => Tile2TumoProbString.get(x))
    //     .join(",");

    //   // 手牌
    //   let hand_tiles = this.hand_tiles
    //     .map(x => Tile2TumoProbString.get(x))
    //     .join(",");

    //   // 手変わりを考慮するかどうか
    //   let tegawari =
    //     this.flag.indexOf(1) != -1 || this.flag.indexOf(2) != -1 ? 1 : 0;

    //   let query = {
    //     bakaze: this.bakaze - 27,
    //     jikaze: this.zikaze - 27,
    //     text0: dora_tiles,
    //     text1: hand_tiles,
    //     tsumo_num: tegawari
    //   };
    //   const searchParams = new URLSearchParams();
    //   Object.keys(query).forEach(k => searchParams.append(k, query[k]));

    //   let url =
    //     "http://critter.sakura.ne.jp/agari_keisan3.cgi?" +
    //     searchParams.toString();

    //   return url;
    // },

    tumoProbStr: function() {
      let hand_tiles = this.hand_tiles
        .map(x => Tile2TumoProbString.get(x))
        .join(",");

      return hand_tiles;
    },

    // 手牌の枚数
    n_hand_tiles: function() {
      return this.hand_tiles.length + this.melded_blocks.length * 3;
    },

    // 各牌の残り枚数
    tile_counts: function() {
      // 初期化する。
      let counts = Array(34)
        .fill(4)
        .concat([1, 1, 1]);

      let minus_tile = tile => {
        counts[tile] -= 1;
        // 赤ドラの場合は対応する牌も減らす。
        if (tile == Tile.AkaManzu5) counts[Tile.Manzu5] -= 1;
        else if (tile == Tile.AkaPinzu5) counts[Tile.Pinzu5] -= 1;
        else if (tile == Tile.AkaSozu5) counts[Tile.Sozu5] -= 1;
      };

      // ドラ表示牌を除く
      this.dora_indicators.forEach(minus_tile);
      // 手牌を除く
      this.hand_tiles.forEach(minus_tile);
      // 副露ブロックを除く
      this.melded_blocks.forEach(block => block.tiles.forEach(minus_tile));

      return counts;
    }
  },

  methods: {
    calculate() {
      this.is_calculating = true;
      this.result = null;

      // JSON を作成する。
      let data = JSON.stringify({
        zikaze: this.zikaze,
        bakaze: this.bakaze,
        turn: this.turn,
        syanten_type: this.syanten_type,
        dora_indicators: this.dora_indicators,
        flag: this.flag.reduce((a, x) => (a += x), 0) + this.maximize_target,
        hand_tiles: this.hand_tiles,
        melded_blocks: this.melded_blocks
      });

      let url;

      if (
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1"
      )
        url = "http://localhost:8888";
      else url = "/apps/mahjong-nanikiru-simulator/post.py";

      // POST する。
      axios
        .post(url, data)
        .then(response => {
          this.result = response.data;
        })
        .catch(() => {
          this.result = {
            success: false,
            err_msg:
              "サーバーとの通信に失敗しました。サービス停止中は利用できません。"
          };
        })
        .finally(() => {
          this.is_calculating = false;
        });
    },

    generateImage() {
      let target = document.querySelector("#problem");
      let config = { useCORS: true };

      html2canvas(target, config).then(canvas => {
        //document.body.appendChild(canvas);
        var a = document.createElement("a");
        a.href = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        a.download = `${Hand2String(this.hand_tiles, this.melded_blocks)}.png`;
        a.click();
      });
    },

    generateText() {
      return Problem2String(
        this.bakaze,
        this.zikaze,
        this.turn,
        this.dora_indicators,
        this.hand_tiles,
        this.melded_blocks
      );
    },

    /// 手牌を初期化する。
    clear_hand() {
      this.hand_tiles = [];
      this.melded_blocks = [];
      this.result = null;
    },

    /// 設定を初期化する。
    clear_all() {
      this.clear_hand();
      this.zikaze = Tile.Ton;
      this.bakaze = Tile.Ton;
      this.turn = 3;
      this.syanten_type = 1;
      this.dora_indicators = [Tile.Ton];
      this.flag = [
        1, // 向聴戻し
        2, // 手変わり
        4, // ダブル立直
        8, // 一発
        16, // 海底自摸
        32 // 裏ドラ
      ];
      this.select_tab = 0;
    },

    downloadHMR() {
      let filename = `${Hand2String(this.hand_tiles)}.hmr`;
      let text = "";

      // 1行目: "<巡目> <自摸牌>"
      let tumo_tile = Aka2Normal(this.hand_tiles[this.hand_tiles.length - 1]);
      text += this.turn + " " + tumo_tile + "\n";
      // 2行目: 各牌の残り枚数
      text += this.tile_counts.slice(0, -3).join("") + "\n";
      // 3行目: 手牌の各牌の枚数
      text += this.toTiles34(this.hand_tiles).join("") + "\n";
      // 4行目: ドラ
      let dora_tile = DoraHyozi2Dora[this.dora_indicators[0]];
      text += this.toTiles34([dora_tile]).join("") + "\n";
      // 5行目: 捨牌
      text +=
        Array(18)
          .fill(-1)
          .join("") + "\n";

      let blob = new Blob([text], { type: "text/plain" });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },

    /// 長さ34の配列形式にする。
    toTiles34(tiles) {
      let tiles34 = Array(34).fill(0);

      for (let tile of tiles) tiles34[Aka2Normal(tile)]++;

      return tiles34;
    },

    /// 牌を手牌に追加する。
    add_tile(tile) {
      this.hand_tiles.push(tile);
      sort_tiles(this.hand_tiles);
    },

    /// 牌を手牌から削除する。
    remove_tile(tile) {
      let i = this.hand_tiles.indexOf(tile);
      if (i > -1) this.hand_tiles.splice(i, 1);
    },

    /// 牌を副露ブロックの一覧に追加する。
    add_meld(block) {
      this.melded_blocks.push(block);
    },

    /// 牌を副露ブロックの一覧から削除する。
    remove_meld(block) {
      let i = this.melded_blocks.findIndex(
        x => JSON.stringify(x) == JSON.stringify(block)
      );
      if (i > -1) this.melded_blocks.splice(i, 1);
    },

    /// 牌をドラ表示牌の一覧に追加する。
    add_dora(tile) {
      this.dora_indicators.push(tile);
    },

    /// 牌をドラ表示牌の一覧から削除する。
    remove_dora(tile) {
      let i = this.dora_indicators.indexOf(tile);
      if (i > -1) this.dora_indicators.splice(i, 1);
    },

    set_random_hand() {
      this.clear_hand();
      const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // 牌山を作成する。
      let yama = [];
      for (let i = 0; i < 27; ++i) {
        yama = yama.concat(Array(4).fill(i));
      }
      yama[Tile.Manzu5 * 4] = Tile.AkaManzu5;
      yama[Tile.Pinzu5 * 4] = Tile.AkaPinzu5;
      yama[Tile.Sozu5 * 4] = Tile.AkaSozu5;

      // ドラ表示牌は削除する。
      for (let tile of this.dora_indicators) {
        let i = yama.indexOf(tile);
        yama.splice(i, 1);
      }

      // 先牌する。
      yama = shuffle(yama);

      let hand_tiles = yama.slice(0, 14);
      sort_tiles(hand_tiles);

      this.hand_tiles = hand_tiles;
    }
  }
};
</script>

<style>
.custom-tooltip > .tooltip-inner {
  max-width: 400px;
  text-align: left;
  padding-top: 5px;
}

#problem ul {
  margin: 0;
  padding: 0;
}

#problem li {
  font-size: 18px;
  display: inline-block;
  vertical-align: middle;
}
</style>
