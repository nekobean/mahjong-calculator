<template>
  <b-jumbotron
    class="pt-2 pb-2"
    header="麻雀何切るシミュレーター (version 0.8.1)"
    header-level="5"
    bg-variant="dark"
    text-variant="light"
  >
    <b-tabs content-class="mt-3" v-model="tabIndex" justified>
      <!-- 概要 -->
      <b-tab
        title="概要"
        :title-link-class="tabIndex == 0 ? 'text-dark' : 'text-light'"
      >
        <p>
          「何切るシミュレーター」は入力された手牌の受入枚数、点数期待値、和了確率、聴牌確率を計算するツールです。
        </p>
        <ul>
          <li>牌画像のボタンをクリックすると、牌を追加できます。</li>
          <li>
            手牌、ドラ表示牌にある牌画像をクリックすると、牌を削除できます。
          </li>
          <li>手牌が14枚になったら、「計算」ボタンをクリックしてください。</li>
          <li v-if="!isMobile">
            「画像で保存」ボタンをクリックすると、牌姿を画像で保存できます。
          </li>
        </ul>
      </b-tab>

      <!-- Q & A -->
      <b-tab
        title="Q & A"
        :title-link-class="tabIndex == 1 ? 'text-dark' : 'text-light'"
      >
        <b-list-group>
          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q.
              打牌Aより打牌Bのほうが期待値が30点高くなりました。打牌Bのほうが優れているということでしょうか。
            </h6>
            <p>
              点数期待値において、50点未満の差はほぼ同等と考えてよいです。
              例えば、手牌「123m999p789s北北北白發」において、白のほうが裏ドラ表示牌が1枚多いため、白単騎だと5032点、發単騎だと5017点で15点差になります。
              このように、数十点というのは裏ドラ表示牌が1枚多いかどうか程度の差しかありません。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 巡目は結果にどのように影響しますか。
            </h6>
            <p>
              巡目があとになるほど、和了確率、聴牌確率が減少しますが、向聴戻しの打牌ほど早く確率が減少していくため、序盤では向聴戻しが有利な結果が出ても、中盤以降はそうでない打牌と優越が逆転します。
              結果一覧の下のグラフで、各巡目ごとの期待値、和了確率、聴牌確率の推移を確認できます。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 他家からの牌の出やすさは考慮されますか
            </h6>
            <p>
              他家が存在しないため、ロン和了が存在しません。そのため、幺九牌待ちのほうが和了やすいといったことは考慮されません。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 副露は考慮されますか</h6>
            <p>
              副露 (ポン、チー、暗槓、明槓、加槓) は考慮しません。
              そのため、役牌や染め手など鳴かないと成立しづらい役の価値が過小評価されます。
              ただし、何切るを考える時点で、副露している手牌は設定可能です。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 向聴戻しは考慮されますか</h6>
            <p>
              向聴戻しは考慮されます。ただし、3向聴から4向聴及び和了形から聴牌への向聴戻しは行いません。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 手変わりは考慮されますか</h6>
            <p>手変わりは考慮します。</p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 赤牌の自摸は考慮されますか</h6>
            <p>
              「赤牌自摸」にチェックが入っている場合、赤牌を自摸する可能性を考慮します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 裏ドラは考慮されますか</h6>
            <p>
              「裏ドラ」にチェックが入っている場合、裏ドラが乗る可能性を考慮します。
              ドラ表示牌が1枚の場合は、裏ドラが乗る確率を厳密に計算します。2枚以上の場合は平和形の場合に裏ドラが乗る確率の統計データを元に近似値で計算します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. ダブル立直、一発、海底撈月は考慮されますか
            </h6>
            <p>
              「ダブル立直」「一発」「海底撈月」にチェックが入っている場合、それぞれの役が成立する可能性を考慮します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 対子が多い手牌ですが、七対子は考慮されますか。
            </h6>
            <p>
              「手牌の種類」が「一般手」の場合、七対子の和了が考慮されません。そのため、一般手と七対子の両天秤を見るべき手牌で正着が選ばれない可能性があります。
              実装上可能であれば、この問題は今後対応する予定です。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 探索範囲を教えて下さい</h6>
            <p>
              手牌が3向聴以下の場合、デフォルト設定では、聴牌まで「向聴数 +
              1枚」交換可能という条件で和了りまでのすべてのパターンを探索します。4向聴以上の場合は有効牌のみ計算します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 積み棒、不聴罰符、立直棒は考慮されますか
            </h6>
            <p>積み棒、不聴罰符、立直棒は考慮しません。</p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 不自然が結果が表示されました。なぜでしょうか。
            </h6>
            <p>
              ロンや副露がない等4人麻雀とは異なる条件でのシミュレーション結果であることに留意する必要があります。
              ただし、プログラムの不具合の可能性もありますので、不自然な結果が表示された牌姿を<b-link
                href="https://pystyle.info/mahjong-nanikiru-simulator/"
                target="_blank"
                class="text-info"
                >コメント欄</b-link
              >で教えていただければ、こちらでも確認します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 具体的な計算方法を教えて下さい。
            </h6>
            <p>
              基本的な考え方は<b-link
                href="https://pystyle.info/mahjong-expected-value-in-mahjong/"
                target="_blank"
                class="text-info"
                >手牌の点数期待値の計算方法</b-link
              >に記載しています。また、アプリケーションのソースコードは GitHub
              のレポジトリ<b-link
                href="https://github.com/nekobean/mahjong-cpp"
                target="_blank"
                class="text-info"
                >mahjong-cpp</b-link
              >に公開しております。時間があるときにアルゴリズムの詳細について、文章で整理しようと思います。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1">参考資料</h6>
            <ul>
              <li>
                <b-link
                  href="https://pystyle.info/mahjong-expected-value-in-mahjong/"
                  target="_blank"
                  class="text-info"
                  >手牌の点数期待値の計算方法</b-link
                >
              </li>
              <li>
                <b-link
                  href="https://pystyle.info/mahjong-uradora-probability/"
                  target="_blank"
                  class="text-info"
                  >裏ドラが乗る確率の計算方法</b-link
                >
              </li>
            </ul>
          </div>
        </b-list-group>
      </b-tab>

      <!-- 更新履歴 -->
      <b-tab
        title="更新履歴"
        :title-link-class="tabIndex == 2 ? 'text-dark' : 'text-light'"
      >
        <ul>
          <li>version 0.1.0 (2021/01/16): アプリを公開</li>
          <li>
            version 0.2.0 (2021/02/11): 和了確率最大化のシミュレーションを追加
          </li>
          <li>
            version 0.3.0 (2021/02/20):
            巡目ごとの期待値、和了確率、聴牌確率のグラフを追加
          </li>
          <li>
            version 0.4.0 (2021/02/23): ドラ表示牌が1枚 (槓ドラなし)
            の場合は、裏ドラの乗る確率を厳密に計算するように修正。2枚以上の場合は平和形を仮定した場合の統計データによる近似になります。
          </li>
          <li>
            version 0.5.0 (2021/03/21): 他の期待値計算ツール (<b-link
              href="https://tenhou.net/2/"
              target="_blank"
              class="text-info"
              >天鳳 / 牌理</b-link
            >、<b-link
              href="http://ara.moo.jp/mjhmr/"
              target="_blank"
              class="text-info"
              >一人麻雀練習機</b-link
            >、<b-link
              href="http://critter.sakura.ne.jp/agari_keisan.html"
              target="_blank"
              class="text-info"
              >ツモアガリ確率計算機</b-link
            >) で検証できる機能を追加
          </li>
          <li>
            version 0.5.1 (2021/04/11):
            確率計算の不具合を修正。計算量削減のため、3向聴から4向聴への向聴戻しは行わないように変更。
          </li>
          <li>
            version 0.6.0 (2021/04/12): 計算時に赤牌の自摸を考慮するように変更
          </li>
          <li>version 0.6.1 (2021/04/16): 巡目の初期設定を変更</li>
          <li>
            version 0.7.0 (2021/07/25): 何切る問題の画像を生成する機能を追加
          </li>
          <li>
            version 0.8.0 (2021/09/24):
            確率計算の不具合修正。(手変わり考慮時の確率値が過大に算出されていた問題等)
          </li>
          <li>version 0.8.1 (2021/10/26): UI のスマホ対応。Q & A を追加。</li>
        </ul>
      </b-tab>
    </b-tabs>

    <hr style="border: 1px solid white" />

    <ul>
      <li>
        version 0.8.1 (2021/10/26) の更新内容: UI のスマホ対応。Q & A を追加。
      </li>
      <li>
        ご意見、ご質問、不具合報告は<b-link
          href="https://pystyle.info/mahjong-nanikiru-simulator/"
          target="_blank"
          class="text-info"
          >ブログ記事</b-link
        >のコメント欄にお願いします。
      </li>
    </ul>

    <p>
      <b-link
        href="https://pystyle.info/mahjong-nanikiru-simulator-todo-list/"
        target="_blank"
        class="text-info"
        >更新予定</b-link
      >
      / GitHub:
      <b-link
        href="https://github.com/nekobean/mahjong-cpp"
        target="_blank"
        class="text-info"
        >mahjong-cpp</b-link
      >
      / 作成者:
      <b-link href="https://pystyle.info/" target="_blank" class="text-info"
        >pystyle</b-link
      >
      / 牌画像:
      <b-link
        href="https://majandofu.com/mahjong-images"
        target="_blank"
        class="text-info"
        >麻雀豆腐</b-link
      >
    </p>

    <b-container v-if="location.hostname != 'localhost'">
      <b-row>
        <b-col>
          <Adsense
            data-ad-client="ca-pub-9930040906284502"
            data-ad-slot="9160643683"
          >
          </Adsense
        ></b-col>
      </b-row>
    </b-container>
  </b-jumbotron>
</template>

<script>
import { isMobile } from "mobile-device-detect";

export default {
  name: "Description",
  data() {
    return {
      tabIndex: 0,
      location: location,
      isMobile: isMobile,
    };
  },
};
</script>
