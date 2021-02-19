<template>
  <div>
    <b-jumbotron
      class="pt-3 pb-3"
      header="麻雀何切るシミュレーター (version 0.3.0)"
      header-level="5"
      bg-variant="dark"
      text-variant="white"
    >
      <p>
        「麻雀何切るシミュレーター」は入力された手牌に対して、受け入れ枚数、聴牌確率、和了確率、期待値などを計算するツールです。
      </p>

      <ul>
        <li>手牌が13枚の場合: 有効牌を表示します。</li>
        <li>
          手牌が14枚の場合:
          各打牌の受入枚数、点数期待値、和了確率、聴牌確率を表示します。<br />
          (4向聴以上の場合は受入枚数のみ)
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

      <ul>
        <li>
          質問や不具合報告は<b-link
            href="https://pystyle.info/mahjong-nanikiru-simulator/"
            target="_blank"
            >ブログ記事</b-link
          >のコメント欄にお願いします。
        </li>
        <li>
          PC 版 Google Chrome で動作確認しています。
        </li>
        <li>
          更新履歴: ver 0.3.0
          各巡目ごとの期待値、和了確率、聴牌確率のグラフ表示を追加
        </li>
      </ul>

      <p>
        <b-link
          href="https://pystyle.info/mahjong-expected-value-in-mahjong/"
          target="_blank"
          >シミュレーションの詳細</b-link
        >
        / GitHub:
        <b-link href="https://github.com/nekobean/mahjong-cpp" target="_blank"
          >mahjong-cpp</b-link
        >
        / 作成者: <b-link href="https://pystyle.info/">pystyle</b-link>
      </p>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: "Description"
};
</script>
