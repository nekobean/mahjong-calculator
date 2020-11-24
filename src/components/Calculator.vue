<template>
  <b-container fluid class="border border-gray p-3">
    <b-row>
      <b-col cols="6">
        <!-- 場風 -->
        <b-form-group
          label-cols="6"
          label="場風:"
          label-for="bakaze"
          label-align="right"
        >
          <b-form-select
            id="bakaze"
            v-model="bakaze"
            :options="kazehai"
            size="sm"
          ></b-form-select>
        </b-form-group>

        <!-- 自風 -->
        <b-form-group
          label-cols="6"
          label="自風:"
          label-for="zikaze"
          label-align="right"
        >
          <b-form-select
            v-model="zikaze"
            :options="kazehai"
            id="zikaze"
            size="sm"
          ></b-form-select>
        </b-form-group>

        <!-- 巡目 -->
        <b-form-group
          label-cols="6"
          label="巡目:"
          label-for="turn"
          label-align="right"
        >
          <b-form-select v-model="turn" id="turn" size="sm">
            <b-form-select-option v-for="i in 18" :key="i" :value="i"
              >{{ i }} 巡目</b-form-select-option
            >
          </b-form-select>
        </b-form-group>

        <!-- 親・子 -->
        <b-form-group
          label-cols="6"
          label="親・子:"
          label-for="parent_or_child"
          label-align="right"
        >
          <b-form-select v-model="is_parent" id="parent_or_child" size="sm">
            <b-form-select-option :value="true">親</b-form-select-option>
            <b-form-select-option :value="false">子</b-form-select-option>
          </b-form-select>
        </b-form-group>

        <!-- 手牌の種類 -->
        <b-form-group
          label-cols="6"
          label="手牌の種類:"
          label-for="syanten_type"
          label-align="right"
        >
          <b-form-select v-model="syanten_type" id="syanten_type" size="sm">
            <b-form-select-option :value="0">一般手</b-form-select-option>
            <b-form-select-option :value="1">七対子手</b-form-select-option>
            <b-form-select-option :value="2">国士無双手</b-form-select-option>
          </b-form-select>
        </b-form-group>

        <!-- ドラ -->
        <b-form-group
          label-cols="6"
          label="ドラ表示牌:"
          label-for="dora_tiles"
          label-align="right"
        >
          <DoraTiles v-on:remove-dora="remove_dora" :dora_tiles="dora_tiles" />
        </b-form-group>

        <!-- 牌の枚数 -->
        <b-form-group
          label-cols="6"
          label="牌の枚数:"
          label-for="n_hand_tiles"
          label-align="right"
        >
          <b-form-input
            v-model="n_hand_tiles"
            id="input-n-tiles"
            size="sm"
            :readonly="true"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-alert v-model="show_alert" variant="danger" dismissible>
          {{ alert_msg }}
        </b-alert>
      </b-col>
    </b-row>

    <!-- 手牌及び副露ブロックの一覧 -->
    <b-row class="mb-3">
      <b-col>
        <HandAndMeldedBlocks
          v-on:remove-tile="remove_tile"
          v-on:remove-block="remove_block"
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
              :n_left_tiles="n_left_tiles"
              :disabled="calc_num_hand_tiles() >= 14"
            />
          </b-tab>
          <b-tab title="明刻子">
            <MinkotuInput
              v-on:add-block="add_block"
              :n_left_tiles="n_left_tiles"
              :disabled="calc_num_hand_tiles() >= 12"
            />
          </b-tab>
          <b-tab title="明順子">
            <MinsyuntuInput
              v-on:add-block="add_block"
              :n_left_tiles="n_left_tiles"
              :disabled="calc_num_hand_tiles() >= 12"
            />
          </b-tab>
          <b-tab title="明槓子">
            <MinkantuInput
              v-on:add-block="add_block"
              :n_left_tiles="n_left_tiles"
              :disabled="calc_num_hand_tiles() >= 12"
            />
          </b-tab>
          <b-tab title="暗槓子">
            <AnkantuInput
              v-on:add-block="add_block"
              :n_left_tiles="n_left_tiles"
              :disabled="calc_num_hand_tiles() >= 12"
            />
          </b-tab>
          <b-tab title="ドラ表示牌">
            <p class="m-2">
              ドラの指定は、ドラ表示牌で行うので注意してください。最大5枚まで設定できます。
            </p>
            <HandTileInput
              v-on:add-tile="add_dora"
              :n_left_tiles="n_left_tiles"
              :disabled="dora_tiles.length >= 5"
            />
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>

    <!-- ボタン -->
    <b-row class="mb-3">
      <b-col cols="auto">
        <b-button
          block
          variant="primary"
          v-on:click="calculate"
          :disabled="calc_num_hand_tiles() != 13 && calc_num_hand_tiles() != 14"
          >計算</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button block variant="primary" v-on:click="clear_hand"
          >手牌をクリア</b-button
        >
      </b-col>
      <b-col cols="auto">
        <b-button block variant="primary" v-on:click="clear_all"
          >設定をクリア</b-button
        >
      </b-col>
    </b-row>

    <!-- 計算結果 -->
    <DrawResult v-if="true" :result="true" />
    <DiscardResult v-else :result="true" />
  </b-container>
</template>

<script>
import { sort_tiles, Tile, DoraHyozi2Dora } from "@/mahjong.js";
import HandAndMeldedBlocks from "@/components/mahjong/HandAndMeldedBlocks.vue";
import DoraTiles from "@/components/mahjong/DoraTiles.vue";
import HandTileInput from "@/components/mahjong/HandTileInput.vue";
import MinkotuInput from "@/components/mahjong/MinkotuInput.vue";
import MinsyuntuInput from "@/components/mahjong/MinsyuntuInput.vue";
import MinkantuInput from "@/components/mahjong/MinkantuInput.vue";
import AnkantuInput from "@/components/mahjong/AnkantuInput.vue";
import DrawResult from "./DrawResult.vue";
import DiscardResult from "./DiscardResult.vue";

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
    DrawResult,
    DiscardResult,
  },
  data: function () {
    return {
      result: null,
      Tile: Tile,
      hand_tiles: [],
      melded_blocks: [],
      bakaze: Tile.Ton,
      zikaze: Tile.Ton,
      is_parent: true,
      syanten_type: 0,
      turn: 1,
      dora_tiles: [Tile.Ton],
      kazehai: [
        { value: Tile.Ton, text: "東" },
        { value: Tile.Nan, text: "南" },
        { value: Tile.Sya, text: "西" },
        { value: Tile.Pe, text: "北" },
      ],
      n_hand_tiles: 0,
      n_left_tiles: Array(34).fill(4).concat([1, 1, 1]),
      show_alert: false,
      alert_msg: "",
    };
  },
  methods: {
    calculate() {
      let data = JSON.stringify({
        zikaze: this.zikaze,
        bakaze: this.bakaze,
        turn: this.turn,
        is_parent: this.is_parent,
        syanten_type: this.syanten_type,
        dora_tiles: this.dora_tiles.map((x) => DoraHyozi2Dora[x]),
        hand_tiles: this.hand_tiles,
        melded_blocks: this.melded_blocks,
      });

      this.result = true;

      return console.log(data);
    },

    clear_hand() {
      this.hand_tiles = [];
      this.melded_blocks = [];
      this.n_hand_tiles = 0;
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    clear_all() {
      this.clear_hand();
      this.zikaze = Tile.Ton;
      this.bakaze = Tile.Ton;
      this.turn = 1;
      this.is_parent = true;
      this.syanten_type = 0;
      this.dora_tiles = [Tile.Ton];
    },

    add_tile(tile) {
      if (this.calc_num_hand_tiles() >= 14) {
        this.show_alert = true;
        this.alert_msg = "14枚を超えるため、牌を追加できません。";
        return;
      } else {
        this.show_alert = false;
        this.alert_msg = "";
      }

      this.hand_tiles.push(tile);
      sort_tiles(this.hand_tiles);
      this.n_hand_tiles = this.calc_num_hand_tiles();
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    remove_tile(tile) {
      this.show_alert = false;
      this.alert_msg = "";
      let i = this.hand_tiles.indexOf(tile);
      this.hand_tiles.splice(i, 1);
      this.n_hand_tiles = this.calc_num_hand_tiles();
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    add_block(block) {
      if (this.calc_num_hand_tiles() >= 12) {
        this.show_alert = true;
        this.alert_msg = "14枚を超えるため、牌を追加できません。";
        return;
      } else {
        this.show_alert = false;
        this.alert_msg = "";
      }

      this.melded_blocks.push(block);
      this.n_hand_tiles = this.calc_num_hand_tiles();
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    remove_block(block) {
      this.show_alert = false;
      this.alert_msg = "";

      let i = this.melded_blocks.findIndex(
        (x) => JSON.stringify(x) == JSON.stringify(block)
      );
      this.melded_blocks.splice(i, 1);
      this.n_hand_tiles = this.calc_num_hand_tiles();
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    add_dora(tile) {
      if (this.dora_tiles.length >= 5) {
        this.show_alert = true;
        this.alert_msg = "5枚を超えるため、ドラを追加できません。";
        return;
      } else {
        this.show_alert = false;
        this.alert_msg = "";
      }

      console.log("ドラ", tile);
      this.dora_tiles.push(tile);
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    remove_dora(tile) {
      if (this.dora_tiles.length == 1) {
        this.show_alert = true;
        this.alert_msg = "ドラをこれ以上削除できません。";
        return;
      } else {
        this.show_alert = false;
        this.alert_msg = "";
      }

      this.show_alert = false;
      this.alert_msg = "";
      let i = this.dora_tiles.indexOf(tile);
      this.dora_tiles.splice(i, 1);
      this.n_left_tiles = this.calc_num_left_tiles();
    },

    calc_num_left_tiles() {
      let counts = Array(34).fill(4).concat([1, 1, 1]);

      let minus_tile = (counts, tile) => {
        if (tile === -1) return;

        counts[tile] -= 1;
        if (tile == Tile.AkaManzu5) {
          counts[Tile.Manzu5] -= 1;
        } else if (tile == Tile.AkaPinzu5) {
          counts[Tile.Pinzu5] -= 1;
        } else if (tile == Tile.AkaSozu5) {
          counts[Tile.Sozu5] -= 1;
        }
      };

      // ドラ表示牌を除く
      for (let tile of this.dora_tiles) {
        minus_tile(counts, tile);
      }

      // 手牌を除く
      for (let tile of this.hand_tiles) {
        minus_tile(counts, tile);
      }

      // 副露ブロックを除く
      for (let block of this.melded_blocks) {
        for (let tile of block.tiles) {
          minus_tile(counts, tile);
        }
      }

      console.log(counts);

      return counts;
    },

    calc_num_hand_tiles() {
      return this.hand_tiles.length + this.melded_blocks.length * 3;
    },
  },
};
</script>

