<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/master/img/akashic-cli.png"/>
</p>

# akashic-cli-init

**akashic-cli-init** は Akashic ゲームのテンプレートを生成するツールです。

通常、ゲーム開発者がこのツールを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## ビルド方法

**akashic-cli-init** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` によりgulpを使ってビルドできます。

```sh
npm install
npm run build
```

## テスト方法

1. [TSLint](https://github.com/palantir/tslint "TSLint")を使ったLint
2. [Jasmine](http://jasmine.github.io "Jasmine")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

## 実行方法
デフォルトのテンプレートで初期化する。
```sh
akashic-cli-init
```

指定したテンプレートで初期化する。
```sh
akashic-cli-init -t typescript
```

akashic-cli-init のテンプレートはローカルテンプレートディレクトリに配置されています。
ローカルテンプレートディレクトリにテンプレートが存在しない場合、
テンプレートを以下の順番で探し、最初に見つかったものを利用します。
1. テンプレート配信サーバ (ただしURLが空文字列の場合このステップは省略)
2. コマンドに付属するファクトリテンプレート
* javascript
* javascript-minimal
* javascript-shin-ichiba-ranking
* typescript
* typescript-minimal
* typescript-shin-ichiba-ranking
テンプレートを再ダウンロードする場合、一度ローカルテンプレートのディレクトリを手動で削除する必要があります。
ローカルテンプレートのディレクトリは akashic-config で未設定の場合、
`~/.akashic-templates` になります。

## 設定項目
akashic-cli-init は以下の設定を利用します。設定は `akashic config` コマンドを利用して行います。
* `init.repository`: テンプレート配信サーバのURL。空文字列の時はサーバを利用しない。デフォルトは空文字列。
* `init.defaultTemplateType`: テンプレートの種類が省略されたときに利用するテンプレート名。デフォルトは `javascript`。
* `init.localTemplateDirectory`: ローカルファイルシステムでテンプレートを保存する場所。デフォルトは `$HOME/.akashic-templates`。

## 開発者向け

### ファクトリテンプレートの更新

ファクトリテンプレートを更新する場合は、 templates-src/ 以下を編集してください。
publish 時に、 templates/ 以下の zip に自動的に反映されます。

### ファクトリテンプレートの追加

ファクトリテンプレートを追加する場合は、 templates-src/ 以下に game-xxx/ デイレクトリを加えて、
templates/template-list.json を編集してください。
game-xxx/ ディレクトリは、 Akashic ゲームである必要があります。
(実装上の制限から、現在は package.json を含むゲームを置くことはできないので注意してください。)

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。

