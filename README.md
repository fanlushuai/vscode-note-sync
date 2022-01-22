# Note Sync - VSCode Extension
Fork from https://github.com/xuzhongpeng/vscode-note-sync
感谢原作者。以使得脚本小子可以飞一会儿。
因为个人觉得个人想法未必成熟，以及原作者独立的想法存在，故而选择独立发版。还请原作者理解。

## Forked 添加功能

1. 提供触发命令。独立快速同步。主动触发。解决问题：原作者版本通过onfilesave的被动触发。并且因为提交频率太高，不得不慢速。导致没有快速的可能性。也没有某些情况需要快速触发的可能性。

2. 触发github workflow。可以通过追加提交信息的方式。配合github。实现工作流。解决问题：比如 云端工作流的控制优化。

  注意：功能2，因为触发的行为，需要push向远程，在仓库无新代码push的时候，追加的提交信息控制，将会在下一个实际push的时候追加上去。即，action动作是延迟在下一个push存在变更数据的操作上。队列保存在内存。重启失效。

## 基本使用配置

创建.vscode/settings.json。文件，输入配置

```

{
  "noteSync.enableNoteSync": true,
  "noteSync.pullStatusMessage": "Note pulling",
  "noteSync.pushStatusMessage": "Notes uploading",
  "noteSync.finishStatusMessage": "Note sync complete",
}

```

开启插件工作状态。

提醒：找不到请新建。主要目的为了保证此危险插件干扰其他正常本地仓库。

更详细的配置，参考vscode，功能贡献。

## 使用建议：
逻辑功能上，本插件没有任何问题。

但是，在实际执行上，发现了一个有趣的现象。调用了showinputbox的注册命令。执行的速度延迟会更低。更快。

所以，syncquickly这个命令，实际上，没有requireAction快。虽然他们触发的提交速度都是基于shortDelayTime.

这一点让我很费解。无力深入研究vscode深入的，调度机制。但是，js的单线程调度机制，也是delaytime不准确的原因。

所以，猜测，vscode可能进一步进行了调整。

使用建议：

如果想要实现，快速的触发。直接调用requireAcion命令，不要输入inputbox直接回车即可。

同时，需要触发action的，需要添加追加备注的，不要设置默认的action。因为这会跳过inputbox。导致慢速。

但是，这属于奇淫技巧。遵循原本设计的逻辑，也是没问题的。至少在原始作者插件的版本上，已经好很多了。

鉴于，目前个人还无法理解这其中的原因。所以，不做逻辑调整。附上建议。期望，更好的体验。