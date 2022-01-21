# Note Sync - VSCode Extension
Fork from https://github.com/xuzhongpeng/vscode-note-sync
感谢原作者。以使得脚本小子可以飞一会儿。
因为个人觉得个人想法未必成熟，以及原作者独立的想法存在，故而选择独立发版。还请原作者理解。

## foked添加功能

1. 提供触发命令。独立快速同步。主动触发。解决问题：原作者版本通过onfilesave的被动触发。并且因为提交频率太高，不得不慢速。导致没有快速的可能性。也没有某些情况需要快速触发的可能性。

2. 触发github workflow。可以通过追加提交信息的方式。配合github。实现工作流。解决问题：比如 云端工作流的控制优化。

注意：功能2，因为触发的行为，需要push向远程，在仓库无新代码push的时候，追加的提交信息控制，将会在下一个实际push的时候追加上去。即，action动作是延迟在下一个push存在变更数据的操作上。队列保存在内存。重启失效。

## 基本使用配置

创建.vscode/settings.json。文件，输入配置

```

{
  "noteSync.enableNoteSync": true,
  "noteSync.pullStatusMessage": "Note pulling",
  "noteSync.runningStatusMessage": "Notes uploading",
  "noteSync.finishStatusMessage": "Note upload complete",
}

```

开启插件工作状态。

提醒：找不到请新建。主要目的为了保证此危险插件干扰其他正常本地仓库。

更详细的配置，参考vscode，功能贡献。