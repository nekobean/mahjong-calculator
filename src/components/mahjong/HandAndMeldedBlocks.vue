<template>
  <div class="hand_and_melded_blocks">
    <!-- 手牌 -->
    <div class="hand_tiles">
      <TileButton
        v-for="(tile, i) in hand"
        :key="i"
        :tile="tile"
        @click-tile="remove_tile"
      />
    </div>
    <!-- 副露ブロックの一覧 -->
    <BlockButton
      v-for="(block, i) in melds.slice().reverse()"
      :key="i"
      :block="block"
      @click-block="remove_block"
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
