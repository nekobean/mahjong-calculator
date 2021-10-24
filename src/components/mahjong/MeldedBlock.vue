<template>
  <div :class="get_classes()">
    <TileImage
      v-for="(tile, i) in get_block(block, seat)"
      :key="i"
      :tile="tile.tile"
      :type="tile.type"
    />
  </div>
</template>

<script>
import TileImage from "./TileImage.vue";
import { Tile, Seat, MeldType } from "@/mahjong.js";

export default {
  name: "MeldedBlock",
  components: { TileImage },
  props: {
    // ブロック
    block: {
      type: Object,
      required: true,
    },
    // どこから鳴いたか
    seat: {
      type: Number,
      required: true,
    },
  },
  methods: {
    get_relative_seat(my_seat, other_seat) {
      let rel_seat = my_seat - other_seat;
      return rel_seat < 0 ? rel_seat + 4 : rel_seat;
    },

    create_pon_block(block, from) {
      let tiles = [];
      tiles.push({
        tile: block.tiles[0],
        type: Seat.Kamitya == from ? "rotate1" : "upright",
      });
      tiles.push({
        tile: block.tiles[1],
        type: Seat.Toimen == from ? "rotate1" : "upright",
      });
      tiles.push({
        tile: block.tiles[2],
        type: Seat.Simotya == from ? "rotate1" : "upright",
      });

      return tiles;
    },

    create_ti_block(block, from) {
      let tiles = [];
      for (const tile of block.tiles) {
        if (tile !== block.discardedTile) {
          tiles.push({ tile: tile, type: "upright" });
        }
      }
      tiles.splice(from - 1, 0, {
        tile: block.discardedTile,
        type: "rotate1",
      });

      return tiles;
    },

    create_ankan_block(block) {
      let tiles = [];
      for (const [i, tile] of block.tiles.entries()) {
        tiles.push({
          tile: i == 0 || i == 3 ? Tile.Null : tile,
          type: "upright",
        });
      }

      return tiles;
    },

    create_minkan_block(block, from) {
      let tiles = [];
      tiles.push({
        tile: block.tiles[0],
        type: Seat.Kamitya == from ? "rotate1" : "upright",
      });
      tiles.push({
        tile: block.tiles[1],
        type: Seat.Toimen == from ? "rotate1" : "upright",
      });
      tiles.push({ tile: block.tiles[2], type: "upright" });
      tiles.push({
        tile: block.tiles[3],
        type: Seat.Simotya == from ? "rotate1" : "upright",
      });

      return tiles;
    },

    create_kakan_block(block, from) {
      let tiles = [];
      for (const [i, tile] of block.tiles.entries()) {
        if (i == from - 1) {
          tiles.push({
            tile: tile,
            type: "rotate1",
          });
        } else if (i == from) {
          tiles.push({
            tile: tile,
            type: "rotate2",
          });
        } else {
          tiles.push({
            tile: tile,
            type: "upright",
          });
        }
      }

      return tiles;
    },

    get_block(block, seat) {
      let from = this.get_relative_seat(seat, block.from);

      switch (block.type) {
        case MeldType.Pon:
          return this.create_pon_block(block, from);
        case MeldType.Ti:
          return this.create_ti_block(block, from);
        case MeldType.Ankan:
          return this.create_ankan_block(block);
        case MeldType.Minkan:
          return this.create_minkan_block(block, from);
        case MeldType.Kakan:
          return this.create_kakan_block(block, from);
      }
    },

    get_classes() {
      let classes = ["melded_block"];

      if (this.block.type == "Kakan") classes.push("kakan_small");

      return classes.join(" ");
    },
  },
};
</script>

<style scoped>
.melded_block {
  display: flex;
  flex-wrap: nowrap;
}

.kakan_small {
  height: 64px;
}

.kakan_large {
  height: 80px;
}

.melded_block > img {
  align-self: flex-end;
}
</style>
