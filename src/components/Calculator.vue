<template>
  <div>
    <b-container fluid class="border border-gray p-3">
      <!-- 設定入力欄 -->
      <b-row>
        <b-col>
          <!-- 場風 -->
          <b-form-group label-cols="2" label="場風" label-align="right">
            <b-form-radio-group
              id="input-bakaze"
              v-model="bakaze"
              :options="bakazeOptions"
              button-variant="outline-primary"
              buttons
            ></b-form-radio-group>
          </b-form-group>

          <!-- 自風 -->
          <b-form-group label-cols="2" label="自風" label-align="right">
            <b-form-radio-group
              id="input-zikaze"
              v-model="zikaze"
              :options="zikazeOptions"
              button-variant="outline-primary"
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
            content-cols="3"
            label="現在の巡目"
            label-align="right"
          >
            <b-form-select v-model="turn" id="input-turn">
              <b-form-select-option v-for="i in 17" :key="i" :value="i"
                >{{ i }} 巡目</b-form-select-option
              >
            </b-form-select>
          </b-form-group>

          <!-- 手牌の種類 -->
          <b-form-group label-cols="2" label="手牌の種類" label-align="right">
            <b-form-radio-group
              id="input-syanten-type"
              v-model="syantenType"
              :options="syantenTypeOptions"
              button-variant="outline-primary"
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

          <!-- 考慮項目 -->
          <b-form-group label-cols="2" label="考慮項目" label-align="right">
            <b-form-checkbox-group
              id="input-flag"
              v-model="flag"
              :options="flagOptions"
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
                <li>裏ドラ: 有効の場合、裏ドラが点数期待値に考慮されます。</li>
              </ul>
            </b-tooltip>
          </b-form-group>

          <!-- 最大化対象 -->
          <b-form-group label-cols="2" label="最大化対象" label-align="right">
            <b-form-radio-group
              id="input-maximize-target"
              v-model="maximize_target"
              :options="maximizeTargetOptions"
              button-variant="outline-primary"
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
                <li>期待値最大化: 期待値が最大となる打牌を選択します。</li>
                <li>
                  和了確率最大化:
                  和了確率が最大となる打牌を選択します。オーラストップなど和了率を重視する場合はこちらを選択してください。
                </li>
              </ul>
            </b-tooltip>
          </b-form-group>
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
                      @remove-dora="removeDora"
                      :DoraIndicators="doraIndicators"
                    />
                  </li>
                </ul>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col>
                <HandAndMeldedBlocks
                  @remove-tile="removeHandTile"
                  @remove-block="removeMeld"
                  :hand="hand"
                  :melds="melds"
                />
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>

      <!-- 手牌及び副露ブロックの入力欄 -->
      <b-row>
        <b-col>
          <b-tabs>
            <b-tab title="手牌" active>
              <HandTileInput
                @add-tile="addHandTile"
                :tileCounts="tileCounts"
                :numHandTiles="numHandTiles"
              />
            </b-tab>
            <b-tab title="ドラ表示牌">
              <p class="m-2">
                ドラはドラ表示牌で指定するので注意してください。槓ドラも含め、最大5枚まで設定できます。
              </p>
              <HandTileInput
                @add-tile="addDora"
                :tileCounts="tileCounts"
                :numDoraTiles="numDoraTiles"
              />
            </b-tab>
            <b-tab title="明刻子">
              <MinkotuInput
                @add-block="addMeld"
                :tileCounts="tileCounts"
                :numHandTiles="numHandTiles"
              />
            </b-tab>
            <b-tab title="明順子">
              <MinsyuntuInput
                @add-block="addMeld"
                :tileCounts="tileCounts"
                :numHandTiles="numHandTiles"
              />
            </b-tab>
            <b-tab title="明槓子">
              <MinkantuInput
                @add-block="addMeld"
                :tileCounts="tileCounts"
                :numHandTiles="numHandTiles"
              />
            </b-tab>
            <b-tab title="暗槓子">
              <AnkantuInput
                @add-block="addMeld"
                :tileCounts="tileCounts"
                :numHandTiles="numHandTiles"
              />
            </b-tab>
            <b-tab title="残り枚数">
              <p class="m-2">
                手牌、ドラ表示牌以外の場に見えてる牌を減らすことができます。
              </p>
              <TileCountsInput
                :tileCounts="tileCounts"
                :usedTileCounts="usedTileCounts"
              />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>

      <!-- ボタン -->
      <b-row class="mb-2">
        <b-col>
          <b-overlay :show="isCalculating" rounded="sm">
            <b-button
              class="mr-2"
              variant="primary"
              @click="calculate"
              :disabled="numHandTiles < 13 || isCalculating"
              >計算を実行 ({{ numHandTiles }}枚)
            </b-button>
            <b-button class="mr-2" variant="primary" @click="clearHand"
              >手牌を初期化
            </b-button>
            <b-button class="mr-2" variant="primary" @click="clearAll"
              >設定を初期化
            </b-button>
            <b-button variant="primary" @click="setRandomHand"
              >ランダムな手牌
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

      <!-- 牌姿の保存 -->
      <b-row align-v="center" class="mb-2">
        <b-col cols="2"> 牌姿を保存 </b-col>
        <b-col>
          <!-- 画像で保存するボタン -->
          <b-button
            v-if="!isMobile"
            class="mr-2"
            variant="primary"
            size="sm"
            @click="downloadProblemAsImage"
            :disabled="numHandTiles != 14"
            >画像で保存
          </b-button>
          <!-- テキストで保存するボタン -->
          <b-button
            variant="primary"
            size="sm"
            v-clipboard:copy="copyProblemAsText()"
            :disabled="numHandTiles != 14"
            >テキストでコピー
          </b-button>
        </b-col>
      </b-row>

      <!-- 他ツール -->
      <b-row v-if="!isMobile" align-v="center">
        <b-col cols="2"> 他ツール </b-col>
        <b-col>
          <!-- 天鳳 / 牌理 -->
          <b-button
            class="mr-2"
            :disabled="numHandTiles % 3 != 2"
            :href="tenhoURL"
            target="_blank"
            variant="success"
            size="sm"
            id="tooltip-tenho-hairi"
            >天鳳 / 牌理
          </b-button>
          <!-- 一人麻雀練習機 -->
          <b-button
            class="mr-2"
            :disabled="
              numHandTiles != 14 ||
              melds.length != 0 ||
              doraIndicators.length != 1
            "
            variant="success"
            size="sm"
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
              <li>一人麻雀練習機を起動します。</li>
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
            :disabled="numHandTiles != 14 || melds.length != 0"
            variant="success"
            size="sm"
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
import { version } from "@/../package.json";
import { isMobile } from "mobile-device-detect";
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
  Problem2String,
} from "@/mahjong.js";

import HandAndMeldedBlocks from "@/components/mahjong/HandAndMeldedBlocks.vue";
import DoraTiles from "@/components/mahjong/DoraTiles.vue";
import HandTileInput from "@/components/mahjong/HandTileInput.vue";
import MinkotuInput from "@/components/mahjong/MinkotuInput.vue";
import MinsyuntuInput from "@/components/mahjong/MinsyuntuInput.vue";
import MinkantuInput from "@/components/mahjong/MinkantuInput.vue";
import AnkantuInput from "@/components/mahjong/AnkantuInput.vue";
import TileCountsInput from "@/components/mahjong/TileCountsInput.vue";
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
    TileCountsInput,
    Result,
  },
  created() {
    this.clearAll();
  },
  data: function () {
    return {
      bakaze: null, // 場風
      zikaze: null, // 自風
      turn: null, // 現在の巡目
      syantenType: null, // 手牌の種類
      doraIndicators: null, // ドラ
      flag: null, // フラグ
      maximize_target: null,
      hand: null, // 手牌
      melds: null, // 副露ブロックの一覧
      result: null, // 結果
      tileCounts: null, // 牌の残り枚数

      version: version,
      isMobile: isMobile,
      isCalculating: false,
      Tile2String: Tile2String,

      // オプション
      // 場風
      bakazeOptions: [
        { value: Tile.Ton, text: Tile2String.get(Tile.Ton) },
        { value: Tile.Nan, text: Tile2String.get(Tile.Nan) },
      ],
      // 自風
      zikazeOptions: [
        { value: Tile.Ton, text: Tile2String.get(Tile.Ton) },
        { value: Tile.Nan, text: Tile2String.get(Tile.Nan) },
        { value: Tile.Sya, text: Tile2String.get(Tile.Sya) },
        { value: Tile.Pe, text: Tile2String.get(Tile.Pe) },
      ],
      // 手牌の種類
      syantenTypeOptions: [
        {
          value: SyantenType.Normal,
          text: SyantenType2String.get(SyantenType.Normal),
        },
        {
          value: SyantenType.Tiitoi,
          text: SyantenType2String.get(SyantenType.Tiitoi),
        },
        {
          value: SyantenType.Kokusi,
          text: SyantenType2String.get(SyantenType.Kokusi),
        },
      ],
      // 考慮項目
      flagOptions: [
        { value: 1, text: "向聴戻し" },
        { value: 2, text: "手変わり" },
        { value: 4, text: "ダブル立直" },
        { value: 8, text: "一発" },
        { value: 16, text: "海底自摸" },
        { value: 32, text: "裏ドラ" },
        { value: 64, text: "赤牌自摸" },
      ],
      // 最大化対象
      maximizeTargetOptions: [
        {
          value: 0,
          text: "期待値最大化",
        },
        {
          value: 128,
          text: "和了確率最大化",
        },
      ],
    };
  },

  computed: {
    // 手牌の枚数
    numHandTiles: function () {
      return this.hand.length + this.melds.length * 3;
    },

    // ドラの枚数
    numDoraTiles: function () {
      return this.doraIndicators.length;
    },

    // 使用中の牌の枚数
    usedTileCounts: function () {
      // 初期化する。
      let counts = Array(34).fill(4).concat([1, 1, 1]);
      counts[Tile.Manzu5] = 3;
      counts[Tile.Pinzu5] = 3;
      counts[Tile.Sozu5] = 3;

      // ドラ表示牌を除く
      this.doraIndicators.forEach((tile) => (counts[tile] -= 1));
      // 手牌を除く
      this.hand.forEach((tile) => (counts[tile] -= 1));
      // 副露ブロックを除く
      this.melds.forEach((block) =>
        block.tiles.forEach((tile) => (counts[tile] -= 1))
      );

      return counts;
    },

    // 「天鳳 / 牌理」の URL
    tenhoURL: function () {
      return "https://tenhou.net/2/?q=" + Hand2TenhoString(this.hand);
    },

    // 「ツモアガリ確率計算機」用の文字列
    tumoProbStr: function () {
      let hand = this.hand.map((x) => Tile2TumoProbString.get(x)).join(",");

      return hand;
    },
  },

  methods: {
    calculate() {
      this.isCalculating = true;
      this.result = null;

      // シミュレーターでは残り牌の五萬、五筒、五索は赤牌を含む。
      let counts = this.tileCounts.slice();
      counts[Tile.Manzu5] += counts[Tile.AkaManzu5];
      counts[Tile.Pinzu5] += counts[Tile.AkaPinzu5];
      counts[Tile.Sozu5] += counts[Tile.AkaSozu5];

      // JSON を作成する。
      let data = JSON.stringify({
        version: this.version,
        zikaze: this.zikaze,
        bakaze: this.bakaze,
        turn: this.turn,
        syanten_type: this.syantenType,
        dora_indicators: this.doraIndicators,
        flag: this.flag.reduce((a, x) => (a += x), 0) + this.maximize_target,
        hand_tiles: this.hand,
        melded_blocks: this.melds,
        counts: counts,
      });

      let url =
        location.hostname === "localhost"
          ? "http://localhost:8888"
          : "/apps/mahjong-nanikiru-simulator/post.py";

      // POST する。
      axios
        .post(url, data)
        .then((response) => {
          this.result = response.data;
        })
        .catch(() => {
          this.result = {
            success: false,
            err_msg:
              "サーバーとの通信に失敗しました。サービス停止中は利用できません。",
          };
        })
        .finally(() => {
          this.isCalculating = false;
        });
    },

    /// 手牌を初期化する。
    clearHand() {
      this.hand = [];
      this.melds = [];
      this.result = null;
      this.tileCounts = this.usedTileCounts;
    },

    /// 設定を初期化する。
    clearAll() {
      this.zikaze = Tile.Ton;
      this.bakaze = Tile.Ton;
      this.turn = 3;
      this.syantenType = SyantenType.Normal;
      this.doraIndicators = [Tile.Ton];
      this.flag = [1, 2, 4, 8, 16, 32, 64];
      this.maximize_target = 0;
      this.hand = [];
      this.melds = [];
      this.result = null;
      this.tileCounts = this.usedTileCounts;
    },

    /// 牌を手牌に追加する。
    addHandTile(tile) {
      this.hand.push(tile);
      this.removeTileFromTileCounts(tile);
      sort_tiles(this.hand);
    },

    /// 牌を手牌から削除する。
    removeHandTile(tile) {
      let i = this.hand.indexOf(tile);
      if (i > -1) {
        this.hand.splice(i, 1);
        this.addTileToTileCounts(tile);
      }
    },

    /// 牌を副露ブロックの一覧に追加する。
    addMeld(block) {
      this.melds.push(block);
      block.tiles.forEach((tile) => this.removeTileFromTileCounts(tile));
    },

    /// 牌を副露ブロックの一覧から削除する。
    removeMeld(block) {
      let i = this.melds.findIndex(
        (x) => JSON.stringify(x) == JSON.stringify(block)
      );
      if (i > -1) {
        this.melds.splice(i, 1);
        block.tiles.forEach((tile) => this.addTileToTileCounts(tile));
      }
    },

    /// 牌をドラ表示牌の一覧に追加する。
    addDora(tile) {
      this.doraIndicators.push(tile);
      this.removeTileFromTileCounts(tile);
    },

    /// 牌をドラ表示牌の一覧から削除する。
    removeDora(tile) {
      let i = this.doraIndicators.indexOf(tile);
      if (i > -1) {
        this.doraIndicators.splice(i, 1);
        this.addTileToTileCounts(tile);
      }
    },

    /// 牌を残り牌に追加する。
    addTileToTileCounts(tile) {
      this.$set(this.tileCounts, tile, this.tileCounts[tile] + 1);
    },

    /// 牌を残り牌から削除する。
    removeTileFromTileCounts(tile) {
      this.$set(this.tileCounts, tile, this.tileCounts[tile] - 1);
    },

    /// ランダムな手牌を設定する。
    setRandomHand() {
      const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // 牌山を作成する。
      let yama = [];
      for (let i = 0; i < 27; ++i) yama = yama.concat(Array(4).fill(i));
      yama[Tile.Manzu5 * 4] = Tile.AkaManzu5;
      yama[Tile.Pinzu5 * 4] = Tile.AkaPinzu5;
      yama[Tile.Sozu5 * 4] = Tile.AkaSozu5;

      // ドラ表示牌は削除する。
      for (let tile of this.doraIndicators) {
        let i = yama.indexOf(tile);
        yama.splice(i, 1);
      }

      // 先牌する。
      yama = shuffle(yama);

      // 先頭14枚を取り出す。
      let hand = yama.slice(0, 14);

      // 理牌する。
      sort_tiles(hand);

      // 手牌をクリアする。
      this.clearHand();
      for (let tile of hand) this.addHandTile(tile);
    },

    // 牌姿をダウンロードする。
    downloadProblemAsImage() {
      let target = document.querySelector("#problem");
      let config = { useCORS: true };

      html2canvas(target, config).then((canvas) => {
        let src = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        var a = document.createElement("a");
        a.href = src;
        a.download = `${Hand2String(this.hand, this.melds)}.png`;
        a.click();
      });
    },

    // 牌姿をテキストでコピーする。
    copyProblemAsText() {
      return Problem2String(
        this.bakaze,
        this.zikaze,
        this.turn,
        this.doraIndicators,
        this.hand,
        this.melds
      );
    },

    /// 牌姿を一人麻雀練習機形式でダウンロードする。
    downloadHMR() {
      const toTiles34 = (tiles) => {
        let tiles34 = Array(34).fill(0);

        for (let tile of tiles) tiles34[Aka2Normal(tile)]++;

        return tiles34;
      };

      let filename = `${Hand2String(this.hand)}.hmr`;
      let text = "";

      // 1行目: "<巡目> <自摸牌>"
      let tumo_tile = Aka2Normal(this.hand[this.hand.length - 1]);
      text += this.turn + " " + tumo_tile + "\n";
      // 2行目: 各牌の残り枚数
      let counts = this.tileCounts.slice();
      counts[Tile.Manzu5] += counts[Tile.AkaManzu5];
      counts[Tile.Pinzu5] += counts[Tile.AkaPinzu5];
      counts[Tile.Sozu5] += counts[Tile.AkaSozu5];
      text += counts.slice(0, -3).join("") + "\n";
      // 3行目: 手牌の各牌の枚数
      text += toTiles34(this.hand).join("") + "\n";
      // 4行目: ドラ
      let dora_tile = DoraHyozi2Dora[this.doraIndicators[0]];
      text += toTiles34([dora_tile]).join("") + "\n";
      // 5行目: 捨牌
      text += Array(18).fill(-1).join("") + "\n";

      let blob = new Blob([text], { type: "text/plain" });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
  },
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
