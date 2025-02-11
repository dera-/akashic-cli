<p align="center">
<img src="https://github.com/akashic-games/akashic-cli/blob/master/img/akashic-cli.png"/>
</p>

# akashic-cli-export-html

**akashic-cli-export-html** は Akashic で作られたゲームを単体動作するよう変換するツールです。

通常、ゲーム開発者がこのライブラリを直接利用する必要はありません。
[akashic-cli](https://github.com/akashic-games/akashic-cli) を利用してください。
akashic-cli は Akashic Engine を使ったゲーム作成を補助するコマンドラインツールです。
Akashic Engineの詳細な利用方法については、 [公式ページ](https://akashic-games.github.io/) を参照してください。

## ビルド方法

**akashic-cli-export-html** はTypeScriptで書かれたjsモジュールであるため、ビルドにはNode.jsが必要です。

`npm run build` によりビルドできます。

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

```sh
akashic-cli-export-html
```

## 内部モジュールの更新方法

`npm run build` で自動的に更新されます。
明示的に更新したい場合、 `./templates` 以下の各 package.json の依存バージョンを書き換えた後、
`npm run build` を再度実行するか、テンプレートのディレクトリで `npm run update` を実行してください。

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/akashic-cli/blob/master/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。

