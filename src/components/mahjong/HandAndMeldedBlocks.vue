<template>
  <div class="hand_and_melded_blocks">
    <!-- 手牌 -->
    <div class="hand_tiles">
      <TileButton
        v-on:add-tile="remove_tile"
        v-for="(tile, i) in hand_tiles"
        :key="i"
        :tile="tile"
        size="lg"
      />
    </div>
    <!-- 副露ブロックの一覧 -->
    <BlockButton
      v-on:add-block="remove_block"
      v-for="(block, i) in melded_blocks.slice().reverse()"
      :key="i"
      :block="block"
      size="lg"
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
};
</script>

<style scoped>
.hand_and_melded_blocks {
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.5);
  height: 80px;
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
