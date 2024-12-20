# トライアンフ入退館フォーム一括入力ブックマークレットジェネレーター
## 概要

トライアンフ入退館フォーム[^1]の入力欄にあらかじめ指定したデータを一括で入力する事ができるブックマークレットを生成するスクリプトになります。<br>
通常早くても1～2分かかる面倒な入力をわずか数秒で送信可能状態にする事ができます。

[^1]:入力フォームはIT系東海地区専用で他の用途への動作は対象外とします。また、入力フォームのURLは機密性の高いものですので非公開とさせていただきます。

## 動作環境

- Windows
  - Microsoft Edge
  - Google Chrome
  - Moziila Firefox
- Mac
  - [^2]
- Android
  - Microsoft Edge
  - Google Chrome
  - Moziila Firefox
- iOS
  - [^2]
  
[^2]:実機が無いので未検証ですが対応済みのコードで記述しています。

## 使い方

URLを参照 https://k2wing.github.io/triumphform-bookmarklet-generator/

## 開発経緯

- ユーザーの名前やEメールは毎回の入力で同じなのに対しそのデータが残らない仕様。
- 同一案件ならほぼ時間の設定も同じなので入力を省略したい。
- 各ブラウザのオートコンプリート(入力欄の途中で補間)が期待通りの動作をしない。
- 上記オートコンプリートは時間入力に未対応。

以上の点を理由にあらかじめ設定しておいたデータを一括で入力しようという事でこのツールを開発しました。
<!-- 
ユーザーの名前やEメールは毎回の入力で同じなのに対しそのデータが次回入力で残っていない仕様なため、あらかじめ設定しておいたデータを一括で入力しよう・・・という事でこのツールを開発しました。
各ブラウザには入力欄の途中で補間してくれる「オートコンプリート」という機能がありますが期待通りの動作をしない事や時間入力には対応しておらずこの問題を解消するには不十分でした。
-->

## 開発環境

- 開発ツール: Visual Studio Code
- 使用言語: javascript, HTML5, CSS3
