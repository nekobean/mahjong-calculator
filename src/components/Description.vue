<template>
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.description variant="info">
          使用方法を表示する
        </b-button>
      </b-card-header>
      <b-collapse id="description" role="tabpanel">
        <div class="p-3 bg-light">
          <p>
            「麻雀何切るシミュレーター」は入力された手牌に対して、以下の計算結果を表示します。
          </p>

          <ul class="list-unstyled">
            <li>
              機能
              <ul>
                <li>手牌が13枚の場合: 有効牌を計算します。</li>
                <li>
                  手牌が14枚の場合: 各打牌の受け入れ枚数、聴牌確率、和了り確率、
                  点数期待値を計算します。
                </li>
                <li>
                  4向聴以上は全探索が計算量の観点で困難のため、受け入れ枚数のみを表示します。
                </li>
              </ul>
            </li>

            <li>
              使い方
              <ul>
                <li>
                  牌及び副露ブロック追加ボタンをクリックすると、手牌に追加されます。
                </li>
                <li>
                  手牌、ドラ表示牌は表示されている牌をクリックするか、「クリア」ボタンで削除できます。
                </li>
                <li>
                  手牌を13枚または14枚設定できたら、「計算」ボタンをクリックしてください。
                </li>
              </ul>
            </li>

            <li>
              条件
              <ul>
                <li>
                  和了りまたは終局するまで、ツモと打牌を繰り返す一人麻雀の想定です。鳴きやロンは考慮されません。
                </li>
                <li>面子落としなどの向聴戻しは考慮されません。</li>
                <li>向聴数が変わらない手変わりは考慮されます。</li>
                <li>場風、自風、ドラ、裏ドラは考慮されます。</li>
              </ul>
            </li>

            <li>
              注意点
              <ul>
                <li>
                  ロン、副露、他家や点棒状況などが考慮されていないため、期待値の高いものが必ずしも正着を意味するわけではありません。
                  何切るを考える際の参考としてご活用ください。
                </li>
              </ul>
            </li>
          </ul>

          <mark>
            ご意見や不具合報告はブログ記事の<a href="">コメント欄</a>または
            GitHub の <a href="">issues</a> にお願いします。
          </mark>
        </div>
      </b-collapse>
    </b-card>
  </div>
</template>

 
<script>
export default {
  name: "Description",
};
</script>
