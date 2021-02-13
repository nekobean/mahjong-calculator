<template>
  <div>
    <b-jumbotron
      class="pt-3 pb-3"
      header="麻雀何切るシミュレーター (version 0.2.0)"
      header-level="5"
      bg-variant="dark"
      text-variant="white"
    >
      <p>
        「麻雀何切るシミュレーター」は入力された手牌に対して、受け入れ枚数、聴牌確率、和了確率、期待値などの情報を表示するツールです。
      </p>

      <ul>
        <li>手牌が13枚の場合: 有効牌を表示します。</li>
        <li>
          手牌が14枚の場合:
          各打牌の受け入れ枚数、点数期待値、和了確率、聴牌確率を表示します。<br />
          (4向聴以上の場合は受け入れ枚数のみ)
        </li>
      </ul>

      <p>
        使い方
      </p>

      <ul>
        <li>
          牌画像のボタンをクリックすると、牌を追加できます。
        </li>
        <li>
          表示されている牌画像をクリックすると、牌を削除できます。
        </li>
        <li>
          手牌が13枚または14枚になったら、「計算」ボタンをクリックしてください。
        </li>
      </ul>

      <hr style="border:1px solid white;" />

      <p>
        ご意見や不具合報告は
        <b-link
          href="https://pystyle.info/mahjong-nanikiru-simulator/"
          target="_blank"
          >ブログ記事</b-link
        >
        または
        <b-link href="https://github.com/nekobean/mahjong-cpp" target="_blank"
          >GitHub</b-link
        >
        にお願いします。 (作成者
        <b-link href="https://pystyle.info/">pystyle</b-link>)
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: "Description"
};
</script>
