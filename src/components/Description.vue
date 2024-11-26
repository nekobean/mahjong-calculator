<template>
  <b-jumbotron
    class="pt-2 pb-2"
    :header="`麻雀何切るシミュレーター version ${version} (2024/11/27更新)`"
    header-level="5"
    style="background-color: #003775"
    text-variant="light"
  >
    <b-tabs content-class="mt-3" v-model="tabIndex" justified>
      <!-- 概要 -->
      <b-tab
        title="概要"
        :title-link-class="tabIndex == 0 ? 'text-dark' : 'text-light'"
      >
        <p>
          「何切るシミュレーター」は入力された手牌の有効牌、点数期待値、和了確率、聴牌確率を計算するツールです。
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
              「向聴戻し」にチェックが入っている場合、向聴数が下がる打牌も考慮します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 手変わりは考慮されますか</h6>
            <p>
              「手変わり」にチェックが入っている場合、向聴数が変わらない自摸も考慮します。
            </p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 赤牌の自摸は考慮されますか</h6>
            <p>
              「赤ドラ」にチェックが入っている場合、赤牌を自摸する可能性を考慮します。
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
            <p>0.9.0 まで考慮していましたが、現在、一旦無効にしています。</p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">
              Q. 対子が多い手牌ですが、七対子は考慮されますか。
            </h6>
            <p>0.9.2 より七対子、国士無双も考慮されるようになりました。</p>
          </div>

          <div class="mb-1">
            <h6 class="mb-1 text-warning">Q. 探索範囲を教えて下さい</h6>
            <p>
              手牌が3向聴以下の場合、デフォルト設定では、聴牌まで「向聴数 +
              1」枚交換で遷移可能な全手牌パターンを探索します。4向聴以上の場合は有効牌のみ計算します。
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
                href="https://pystyle.info/mahjong-nanikiru-simulator/#comments"
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
              >に公開しております。
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
          <li>version 0.8.1 (2021/10/26): UI を修正。Q & A を追加。</li>
          <li>
            version 0.9.0 (2021/11/07):
            残り枚数を設定できる機能を追加。牌の枚数が13枚の場合も期待値を計算するように変更。
          </li>
          <li>
            version 0.9.2 (2024/11/25): 計算アルゴリズムを全体的に見直し。
          </li>
          <li>
            version 0.9.3 (2024/11/25):
            残り枚数が反映されていなかった問題を修正。巡目変更機能を実装。
          </li>
        </ul>
      </b-tab>
    </b-tabs>

    <hr style="border: 1px solid white" />

    <p>
      version 0.9.2 (2024/11/25):<br />
      計算アルゴリズムを全体的に見直しました。一部報告されていた不自然な計算結果は改善したと思います。
      <br />
      新バージョンは試験運用中です。以前のバージョンは、
      <b-link
        href="https://pystyle.info/apps/mahjong-nanikiru-simulator_090/"
        target="_blank"
        class="text-info"
        >バージョン 0.9.0</b-link
      >
      から使えるようにしています。
      <br />
      不具合や使ってみた感想は、
      <b-link
        href="https://pystyle.info/mahjong-nanikiru-simulator/#comments"
        target="_blank"
        class="text-info"
        >ブログ記事</b-link
      >のコメント欄にお願いします。<br />
    </p>

    <hr style="border: 1px solid white" />
    以下に前バージョンとの違いを記載しています。
    <ul>
      <li>計算アルゴリズムの変更による精度の向上。</li>
      <li>
        一部の手牌で向聴数が正しく計算できていなかった問題を修正しました。(4枚持ちを含む手牌など)
      </li>
      <li>
        一般形、七対子、国士無双を同時に考慮して計算するように変更しました。(前バージョンでは七対子との両天秤は見れなかった)
      </li>
      <li>
        前バージョンに合った点数計算時のダブル立直、一発、海底撈月の考慮は一旦無効にしています。
      </li>
      <li>
        期待値、和了確率、聴牌確率の計算は、それぞれ最大化するように打牌した場合の値を表示するように変更しました。
      </li>
      <li>
        バージョン 0.9.3 (2024/11/27):
        残り枚数が反映されていなかった問題を修正しました。
      </li>
    </ul>

    <hr style="border: 1px solid white" />

    <ul>
      ご意見、ご質問、不具合報告は<b-link
        href="https://pystyle.info/mahjong-nanikiru-simulator/#comments"
        target="_blank"
        class="text-info"
        >ブログ記事</b-link
      >のコメント欄にお願いします。
    </ul>

    <p>
      GitHub:
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
import { version } from "@/../package.json";
import { isMobile } from "mobile-device-detect";

export default {
  name: "Description",
  data() {
    return {
      version: version,
      tabIndex: 0,
      location: location,
      isMobile: isMobile,
    };
  },
};
</script>
