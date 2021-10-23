<template>
  <div :class="get_class">
    <!-- 手牌 -->
    <div class="hand_tiles">
      <TileButton
        @add-tile="remove_tile"
        v-for="(tile, i) in hand_tiles"
        :key="i"
        :tile="tile"
        :size="size"
      />
    </div>
    <!-- 副露ブロックの一覧 -->
    <BlockButton
      @add-block="remove_block"
      v-for="(block, i) in melded_blocks.slice().reverse()"
      :key="i"
      :block="block"
      :size="size"
    />
  </div>
</template>

<script>
import TileButton from "./TileButton.vue";
import BlockButton from "./BlockButton.vue";

export default {
  name: "HandAndMeldedBlocks",
  components: {
    TileButton,
    BlockButton,
  },
  props: {
    hand_tiles: {
      type: Array,
      required: true,
    },
    melded_blocks: {
      type: Array,
      required: true,
    },
    size: {
      type: String,
      default: "sm",
    },
  },
  methods: {
    remove_tile(tile) {
      this.$emit("remove-tile", tile);
    },

    remove_block(block) {
      this.$emit("remove-block", block);
    },
  },

  computed: {
    // 手牌の枚数
    get_class: function () {
      return this.size == "lg"
        ? "hand_and_melded_blocks"
        : "hand_and_melded_blocks_sm";
    },
  },
};
</script>

<style scoped>
.hand_and_melded_blocks {
  display: flex;
  flex-wrap: wrap;
  height: 80px;
}

.hand_and_melded_blocks_sm {
  display: flex;
  flex-wrap: wrap;
  height: 50px;
}

.hand_and_melded_blocks_sm > * {
  align-self: flex-end;
  margin-right: 5px;
}

.hand_and_melded_blocks > * {
  align-self: flex-end;
  margin-right: 10px;
}

.hand_tiles {
  display: flex;
  flex-wrap: wrap;
}
</style>
