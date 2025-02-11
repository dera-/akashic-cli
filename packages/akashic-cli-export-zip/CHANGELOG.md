# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.9](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.8...@akashic/akashic-cli-export-zip@0.3.9) (2019-04-03)

**Note:** Version bump only for package @akashic/akashic-cli-export-zip





## [0.3.8](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.7...@akashic/akashic-cli-export-zip@0.3.8) (2019-03-28)


### Bug Fixes

* fix broken --no-es5-downpile option ([6d959b9](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/6d959b9))





## [0.3.7](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.6...@akashic/akashic-cli-export-zip@0.3.7) (2019-03-18)


### Bug Fixes

* fix warning section at npm audit ([#41](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/41)) ([f476fd8](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/f476fd8))





## [0.3.6](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.5...@akashic/akashic-cli-export-zip@0.3.6) (2019-03-12)

**Note:** Version bump only for package @akashic/akashic-cli-export-zip





## [0.3.5](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.4...@akashic/akashic-cli-export-zip@0.3.5) (2019-03-06)

**Note:** Version bump only for package @akashic/akashic-cli-export-zip





## [0.3.4](https://github-com-akashic-cli/akashic-games/akashic-cli/compare/@akashic/akashic-cli-export-zip@0.3.3...@akashic/akashic-cli-export-zip@0.3.4) (2019-03-04)


### Bug Fixes

* delete unnecessary files and make test work ([#31](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/31)) ([4517689](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/4517689))





## 0.3.3 (2019-02-22)


### Features

* Make akashic-cli mono-repo ([#30](https://github-com-akashic-cli/akashic-games/akashic-cli/issues/30)) ([fd5aa71](https://github-com-akashic-cli/akashic-games/akashic-cli/commit/fd5aa71))





## 0.3.2
* 処理完了時に出力しているログ `Done` の出力場所を修正。

## 0.3.1
* `--strip` オプションを指定した動作をデフォルトの挙動に修正。
* `--strip` を無効にしたい場合、 `--no-strip` を指定することで strip を無効にできます。

## 0.3.0
* `--force` オプションを追加
  * このオプションが与えられない場合、出力先ディレクトリ名またはファイル名が既に存在する場合、エラーになります
* npm auditで警告がでているモジュールの更新
  * モジュールの更新で `archiver#bulk()` が廃止されていたため `archiver#file()` に修正
* 参照されないスクリプトアセットを非グローバル化

## 0.2.7
* stripモードとbundleモードを同時に使うとエラーが発生してしまう問題の修正

## 0.2.6
* akashic-cli-commons@0.2.11 を利用するように
  * 対象のコンテンツのスクリプトがes5構文に沿っているかを判定する処理の追加

## 0.2.5
* akashic-cli-commons@0.2.10 を利用するように
  * `--hash-filename` オプション有効時、ディレクトリパスもハッシュ化する。

## 0.2.4
* akashic-cli-commons@0.2.9 を利用するように
  * `--hash-filename` オプション有効時、 `moduleMainScripts` の値がおかしかった問題を修正。

## 0.2.3
* 誤って @types/fs-extra が dependencies に含まれていた問題を修正。

## 0.2.2
* akashic-cli-commons@0.2.8 を利用するように
* ハッシュ化する場合、 game.json を適切に扱えていなかった問題を修正。

## 0.2.1
* `--hash-filename` オプションを追加
  * 出力される各ファイルのファイル名をハッシュ化しリネームします。（デフォルトのファイル名文字数は20）

## 0.2.0

* 実装を全面的に見直し
  * `--bundle` オプションを追加。
    * エントリポイントからrequire()で参照されるスクリプトアセットを一つにまとめます。
    * 指定する場合、エントリポイントから(間接的に)require()されるスクリプトアセットはgame.jsonから取り除かれます。
      (アセットとしてロードできなくなります)
  * `--strip` オプションを追加。(ゲーム実行に不要なファイルを除きます)
  * `--minify` オプションを追加。(スクリプトアセットをminifyします)
  * `--exclude` オプションを廃止。(代わりに `--strip` を利用してください)
  * `-o` オプションの値の末尾が `".zip"` でない場合、ディレクトリとみなして出力し、zip圧縮しないように。

## 0.1.0

* Node.js 7 対応

## 0.0.3

* 初期リリース
