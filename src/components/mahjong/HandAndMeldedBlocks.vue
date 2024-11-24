<template>
  <div class="hand_and_melded_blocks">
    <!-- 手牌 -->
    <div class="hand_tiles">
      <template v-if="show_only">
        <TileImage v-for="(tile, i) in hand" :key="i" :tile="tile" />
      </template>
      <template v-else>
        <TileButton
          v-for="(tile, i) in hand"
          :key="i"
          :tile="tile"
          @click-tile="remove_tile"
        />
      </template>
    </div>
    <!-- 副露ブロックの一覧 -->
    <BlockButton
      v-for="(block, i) in melds"
      :key="i"
      :block="block"
      @click-block="remove_block"
      :show_only="show_only"
    />
  </div>
</template>

<script>
import TileButton from "./TileButton.vue";
import TileImage from "./TileImage.vue";
import BlockButton from "./BlockButton.vue";

export default {
  name: "HandAndMeldedBlocks",
  components: {
    TileButton,
    BlockButton,
    TileImage,
  },
  props: {
    // 手牌
    hand: {
      type: Array,
      required: true,
    },
    // 副露ブロックの一覧
    melds: {
      type: Array,
      required: true,
    },
    show_only: {
      type: Boolean,
      required: false,
      default: false,
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
};
</script>

<style scoped>
.hand_and_melded_blocks {
  display: flex;
  flex-wrap: wrap;
  height: 50px;
}

.hand_and_melded_blocks > * {
  align-self: flex-end;
  margin-right: 5px;
}

.hand_tiles {
  display: flex;
  flex-wrap: wrap;
}
</style>
