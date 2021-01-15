<template>
  <div>
    <b-jumbotron
      class="pt-3 pb-3"
      header="何切るシミュレーター (version 0.1.0)"
      header-level="5"
      bg-variant="dark"
      text-variant="white"
    >
      <p>
        「何切るシミュレーター」は入力された手牌に対して、以下の情報を表示するツールです。
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

      <ul>
        <li>
          <mark
            >現在開発中のため、不具合があるかもしれません。ご意見や不具合報告は
            <b-link
              href="https://pystyle.info/mahjong-nanikiru-calculator/"
              target="_blank"
              >ブログ記事</b-link
            >
            または
            <b-link
              href="https://github.com/nekobean/mahjong-cpp"
              target="_blank"
              >GitHub</b-link
            >
            にお願いします。</mark
          >
        </li>
        <li>
          PC 版 Chrome ブラウザでのみ動作確認をしています。
        </li>
        <li>
          使用している牌画像の配布元:
          <b-link
            href="https://casinoconcierge.cc/mahjong-images"
            target="_blank"
            >カジノコンシェルジュ</b-link
          >
        </li>
      </ul>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  name: "Description"
};
</script>
