# Note Sync - VSCode Extension
Fork from https://github.com/xuzhongpeng/vscode-note-sync

感谢原作者。因为个人觉得个人想法未必成熟，以及原作者独立的想法存在，故而选择独立发版。还请原作者理解。

## 功能
1. 无感知的git仓库同步。相当于云盘同步。
2. 主动命令触发。用于解决一些，比如，马上要关机走人，快速同步一下的需求。
3. 可追加commitmsg，来操控github workflow。如追加，#deploy blog ，配合github workflow使用

注：与原作者版本对比：1都具备。2的部分，独有。

## 开启
创建.vscode/settings.json，输入配置

```
{
  "noteSync.enableNoteSync": true,
  "noteSync.pullStatusMessage": "Note pulling",
  "noteSync.pushStatusMessage": "Notes uploading",
  "noteSync.finishStatusMessage": "Note sync complete",
}
```

开启插件工作状态。

提醒：找不到请新建。采用工作区创建文件的方式开启。主要目的为了保证此危险插件干扰其他正常本地仓库。

## 使用
1. 配置开启，即可感受自动同步的功能。

2. 主动触发&追加commit msg。命令 `syncquickly`

注意：操控github workflow，需要在ci文件中。加入commit msg的判断。比如：
```

xxxxx 

jobs:
  deploy:
    runs-on: ubuntu-18.04
    if: ${{ contains(github.event.head_commit.message, '#deploy blog') }}
    steps:
      xxxxxx
```

## 执行逻辑
### a. 何时pull？
1. 开机启动，自动pull远程。
2. push时，出现远程分支冲突，自动pull远程。

### b. 何时push？
1. 被动无感知push。文件保存的时候，会push。（这个push时间不会那么即时）
2. 主动有目的push。调用命令，会push。 （可以即时一点）
3. 配合github。追加commit msg，用于配合远程github workflow检测。（比如控制workflow的执行开关）

## 特别说明：
### 关于主动push命令即时性的问题：
在实际执行上，发现了一个有趣的现象。调用了showinputbox的注册命令。执行的速度延迟会更低。更快。

所以，syncquickly这个命令，实际上，没有requireAction快。虽然他们触发的提交速度都是基于shortDelayTime.

这一点让我很费解。无力深入研究vscode深入的，调度机制。但是，js的单线程调度机制，也是delaytime不准确的原因。

所以，猜测，vscode可能进一步进行了调整。

所以在使用上，建议，只使用requireAction命令即可，在inputbox不输入即可。

### 追加commit msg会发生在一次真正的push上
在仓库无新代码push的时候，追加的提交信息控制，将会在下一个实际push的时候追加上去。即，action动作是延迟在下一个push存在变更数据的操作上。队列保存在内存。重启失效。
