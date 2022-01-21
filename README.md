# Note Sync - VSCode Extension
Fork from https://github.com/xuzhongpeng/vscode-note-sync
Add Fearture Append special comment for my blog deploy。and push after a short delay time by vscode command。
## Features(功能)
1. 打开笔记后自动同步代码（建议在需要使用该插件的项目中在`.vscode->settings`中配置`noteSync.enableNoteSync`:`true`，否则不运行此插件，为了使用其它项目的时候的性能和安全）
2. 保存代码后自动Push代码到Github或者Gitlab
3. 使用命令sync，弹出输入框，直接enter或者输入追加的，git comment。

注意：3，可以用于联动github 用来拦截action的执行。workflow push 事件下，通过提交消息决定是否deloy，action build blog等action场景。

```
在github aciton中可以加入这样的条件。
    if: ${{ contains(github.event.head_commit.message, '#deploy') }}
```

## Attention（注意）

It is recommended to open the '. Vscode > Settings' in the project that needs to use the plug-in` noteSync.enableNoteSync `Otherwise, the plug-in will not be run. In order to use the performance and security opened by other projects

建议在需要使用该插件的项目中在`.vscode->settings`中配置`noteSync.enableNoteSync`:`true`，否则不运行此插件，为了使用其它项目开启的性能和安全

## Configuration


## Sample Configuration

```
{
  "noteSync.enableNoteSync": true,
  "noteSync.pullStatusMessage": "Note pulling",
  "noteSync.pushStatusMessage": "Notes uploading",
  "noteSync.finishStatusMessage": "Note sync complete", //同步完成，包含，下拉同步，以及上传同步。统称同步。即进行过一次同步操作。
}
```
## License
MIT
