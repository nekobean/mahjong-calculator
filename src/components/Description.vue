<template>
  <div>
    <b-jumbotron
      class="pt-2 pb-2"
      header="麻雀何切るシミュレーター (version 0.8.0)"
      header-level="5"
      bg-variant="dark"
      text-variant="light"
    >
      <b-tabs content-class="mt-3" v-model="tabIndex" justified>
        <!-- 概要 -->
        <b-tab title="概要" :title-link-class="linkClass(0)">
          <p>
            「麻雀何切るシミュレーター」は入力された手牌の受入枚数、点数期待値、和了確率、聴牌確率を計算するツールです。
          </p>
          <ul>
            <li>牌画像のボタンをクリックすると、牌を追加できます。</li>
            <li>
              手牌、ドラ表示牌にある牌画像をクリックすると、牌を削除できます。
            </li>
            <li>
              手牌が13枚または14枚になったら、「計算」ボタンをクリックしてください。
            </li>
            <li>
              【PCのみ】「画像で保存する」ボタンをクリックすることで牌姿を画像でダウンロードできます。
            </li>
          </ul>
        </b-tab>

        <!-- 前提条件 -->
        <b-tab title="前提条件" :title-link-class="linkClass(1)">
          <ul>
            <li>自摸回数は「18 - 現在の巡目」回です。(※1)</li>
            <li>
              副露 (ポン、チー、暗槓、明槓、加槓)
              は考慮しません。ただし、何切るを考える時点で、副露している手牌は設定可能です。
            </li>
            <li>赤牌の自摸は考慮されます。</li>
            <li>積み棒、不聴罰符、立直棒は点数計算に考慮しません。</li>
            <li>東家の場合は親、それ以外の場合は子として点数計算します。</li>
            <li>
              「考慮する項目」で有効の場合、裏ドラ、ダブル立直、一発、海底撈月
              (※2) は点数計算に考慮します。
            </li>
            <li>
              「考慮する項目」で有効の場合、向聴戻し、手変わり (※3)
              は考慮します。
            </li>
          </ul>

          <p>
            ※1
            4人麻雀では鳴きが入らない場合、東家と南家は最大18回、西家と北家は最大17回自摸れるため、配牌13枚から18回自摸れるものと仮定します。
            例えば、1巡目の場合はすでに1回自摸して手牌が14枚になっているため、あと17回自摸が行えます。
          </p>
          <p>
            ※2 ドラが1枚の場合は、「<b-link
              href="https://pystyle.info/mahjong-uradora-probability/"
              target="_blank"
              class="text-info"
              >裏ドラが乗る確率の計算方法</b-link
            >」に基づき、裏ドラの乗る確率を厳密に計算します。槓ドラがある場合、裏ドラが乗る期待値を厳密に計算するには計算量が多くなるため、平和形での裏ドラが乗る枚数に関する統計データを元に計算します。
          </p>
          <p>
            ※3: 計算量の観点で、最大で「現在の向聴数 +
            2枚」まで牌交換可能という条件で探索します。例えば、2向聴数の場合、最短で3枚交換すると和了れます。そのため、+1
            枚まで余分に交換できるものとして、向聴戻しや手変わりは和了までのいずれかのタイミングで1回のみ考慮することになります。
            また、安目を引いてしまった場合に和了逃しするなど、和了を逃して向聴戻しすることは考慮しません。
          </p>

          <p>計算方法</p>

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
        </b-tab>

        <!-- 結果の解釈 -->
        <b-tab title="結果の解釈" :title-link-class="linkClass(2)">
          <p>
            本シミュレーターが示す上位の打牌が実戦において必ずしも正着であるとは限りません。参考程度にご活用ください。
          </p>

          <p>計算結果を解釈する上で留意する事項</p>
          <ul>
            <li>
              点数期待値において、50点未満の差はほぼ同等と考えてよいです。
              例えば、手牌「123m999p789s北北北白發」において、白のほうが裏ドラ表示牌が1枚多いため、白単騎だと5032点、發単騎だと5017点で15点差になります。
              このように、数十点というのは裏ドラ表示牌が1枚多いかどうか程度の差しかありません。
            </li>
            <li>
              他家が存在しないため、ロン和了が存在しません。そのため、幺九牌待ちのほうが和了やすいといったことは考慮されません。
            </li>
            <li>
              他家が存在しないため、副露が存在しません。そのため、役牌や染め手など鳴かないと成立しづらい役の価値が過小評価されます。
              副露を考慮する牌理は
              <b-link
                href="http://yabejp.web.fc2.com/mahjong/tactics.html"
                target="_blank"
                class="text-info"
                >現代麻雀技術論</b-link
              >
              などを参考にルールベースで考えるとよいと思います。
            </li>
            <li>
              「手牌の種類」が「一般手」の場合、七対子の和了が考慮されません。そのため、一般手と七対子の両天秤を見るべき手牌で正着が選ばれない可能性があります。
              実装上可能であれば、この問題は今後対応する予定です。
            </li>
          </ul>
        </b-tab>

        <!-- 更新履歴 -->
        <b-tab title="更新履歴" :title-link-class="linkClass(3)">
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
          </ul>
        </b-tab>
      </b-tabs>

      <hr style="border: 1px solid white" />

      <p>version 0.8.0 (2021/9/24) の更新内容</p>

      <ul>
        <li>
          手変わり考慮時に確率が1%～3%前後過剰に算出されていた問題を修正。これにより一部の牌姿で聴牌確率が100%を超えて表示されていた問題も修正されました。この修正により、以前のバージョンで得られていた結果が大きく変化することはありません。
        </li>
      </ul>

      <p>
        アップデートにより不具合が生じた場合はもとに戻します。不自然なシミュレーション結果が表示された牌姿がありましたら、<b-link
          href="https://pystyle.info/mahjong-nanikiru-simulator/"
          target="_blank"
          class="text-info"
          >コメント欄</b-link
        >で教えていただければ調査します。
      </p>

      <hr style="border: 1px solid white" />

      <ul>
        <li>
          ご意見、ご質問、不具合報告は<b-link
            href="https://pystyle.info/mahjong-nanikiru-simulator/"
            target="_blank"
            class="text-info"
            >ブログ記事</b-link
          >のコメント欄にお願いします。
        </li>
        <li>PC 版 Google Chrome で動作確認をしています。</li>
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

      <!-- 
      <div class="mb-3">
        <span class="mr-2">シェアする</span>
        <template v-for="sns in ['Twitter', 'Facebook', 'Line']">
          <ShareNetwork
            :key="sns"
            :network="sns"
            url="https://pystyle.info/apps/mahjong-nanikiru-simulator/"
            title="麻雀何切るシミュレーター"
            description="麻雀何切るシミュレーターは、入力された手牌の受入枚数、点数期待値、和了確率、聴牌確率を計算するツールです。"
            hashtags="麻雀,何切る"
            :class="[sns, 'social-button']"
          >
            {{ sns }}
          </ShareNetwork>
        </template>
      </div> -->

      <b-container>
        <b-row>
          <b-col>
            <Adsense
              data-ad-client="ca-pub-9930040906284502"
              data-ad-slot="9160643683"
            >
            </Adsense
          ></b-col>
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
  </div>
</template>

<script>
export default {
  name: "Description",

  data() {
    return {
      tabIndex: 0,
    };
  },

  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return "text-dark";
      } else {
        return "text-light";
      }
    },
  },
};
</script>

<style scoped>
.social-button {
  font-weight: bold;
  color: white;
  border-radius: 3px;
  margin-right: 10px;
  width: 100px;
  height: 25px;
  text-align: center;
  display: inline-block;
}

.Facebook {
  background-color: #2e4a88;
  box-shadow: 0 4px 0 #1b3d82;
}

.Twitter {
  background-color: #008dde;
  box-shadow: 0 4px 0 #0078bd;
}

.Line {
  background-color: #22cc47;
  box-shadow: 0 4px 0 #14ba5f;
}
</style>
