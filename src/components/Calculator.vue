<template>
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
        </b-form-group>

        <!-- ドラ -->
        <b-form-group
          label-cols="2"
          content-cols="4"
          label="ドラ表示牌"
          label-for="input-dora-indicators"
          label-align="right"
        >
          <DoraTiles
            v-on:remove-dora="remove_dora"
            :dora_tiles="dora_indicators"
          />
        </b-form-group>

        <!-- フラグ -->
        <b-form-group
          label-cols="2"
          label="考慮する項目"
          label-for="input-flag"
          label-align="right"
        >
          <b-form-checkbox-group
            v-model="flag"
            :options="input_flag_options"
            size="sm"
            switches
          ></b-form-checkbox-group>
        </b-form-group>

        <!-- 牌の枚数 -->
        <b-form-group
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
        </b-form-group>
      </b-col>
    </b-row>

    <!-- 手牌及び副露ブロックの一覧 -->
    <b-row class="mb-3">
      <b-col>
        <HandAndMeldedBlocks
          v-on:remove-tile="remove_tile"
          v-on:remove-block="remove_meld"
          :hand_tiles="hand_tiles"
          :melded_blocks="melded_blocks"
          size="lg"
        />
      </b-col>
    </b-row>

    <!-- 手牌及び副露ブロックの入力欄 -->
    <b-row>
      <b-col>
        <b-tabs>
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
    <b-row class="mb-3">
      <b-col>
        <b-button
          class="mr-2"
          variant="primary"
          @click="calculate"
          :disabled="
            (n_hand_tiles != 13 && n_hand_tiles != 14) || is_calculating
          "
          >計算を実行</b-button
        >
        <b-button class="mr-2" variant="primary" @click="clear_hand"
          >手牌を初期化</b-button
        >
        <b-button variant="primary" @click="clear_all">設定を初期化</b-button>
      </b-col>
    </b-row>

    <!-- 計算結果 -->
    <Result :result="result" />
  </b-container>
</template>

<script>
import axios from "axios";
import {
  sort_tiles,
  Tile,
  DoraHyozi2Dora,
  Tile2String,
  SyantenType,
  SyantenType2String
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
      turn: 1, // 現在の巡目
      syanten_type: SyantenType.Normal, // 手牌の種類
      dora_indicators: [Tile.Ton], // ドラ
      flag: [1, 4, 16, 8, 32], // フラグ
      hand_tiles: [2, 3, 3, 4, 5, 5, 6, 8, 8, 15, 16, 16, 24, 26], // 手牌
      melded_blocks: [], // 副露ブロックの一覧
      result: null, // 結果
      is_calculating: false,

      // オプション
      // 場風
      input_bakaze_options: [
        { value: Tile.Ton, text: Tile2String.get(Tile.Ton) },
        { value: Tile.Nan, text: Tile2String.get(Tile.Nan) },
        { value: Tile.Sya, text: Tile2String.get(Tile.Sya) },
        { value: Tile.Pe, text: Tile2String.get(Tile.Pe) }
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
      // フラグ
      input_flag_options: [
        { value: 1, text: "向聴落とし" },
        { value: 2, text: "手変わり (実装中)", disabled: true },
        { value: 4, text: "ダブル立直" },
        { value: 8, text: "一発" },
        { value: 16, text: "海底自摸" },
        { value: 32, text: "裏ドラ" }
      ]
    };
  },

  computed: {
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

  created: function() {
    this.calculate();
  },

  methods: {
    calculate() {
      this.is_calculating = true;

      // JSON を作成する。
      let data = JSON.stringify({
        zikaze: this.zikaze,
        bakaze: this.bakaze,
        turn: this.turn,
        syanten_type: this.syanten_type,
        dora_tiles: this.dora_indicators.map(x => DoraHyozi2Dora[x]),
        flag: this.flag.reduce((a, x) => (a += x), 0),
        hand_tiles: this.hand_tiles,
        melded_blocks: this.melded_blocks
      });
      console.log(data);

      // POST する。
      axios
        .post("http://localhost:8888", data)
        .then(response => {
          //console.log(JSON.stringify(response.data.response));
          this.result = response.data;
        })
        .catch(err => {
          console.log(err);
        });

      this.is_calculating = false;
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
      this.turn = 1;
      this.syanten_type = 1;
      this.dora_indicators = [Tile.Ton];
      this.flag = [
        1, // 向聴落とし
        4, // ダブル立直
        8, // 一発
        16, // 海底自摸
        32 // 裏ドラ
      ];
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
    }
  }
};
</script>
