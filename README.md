# Note Sync - VSCode Extension
Fork from https://github.com/xuzhongpeng/vscode-note-sync

## 功能
1. 无感知的git仓库同步。相当于云盘同步。
2. **[本fork新增]**主动命令触发。用于解决一些，比如，马上要关机走人，快速同步一下的需求。
3. **[本fork新增]**可追加commitmsg，来操控github workflow。如追加，#deploy blog ，配合github workflow使用

## 开启
1. 创建.vscode/settings.json，输入配置

```
{
  "noteSync.enableNoteSync": true,
  "noteSync.pullStatusMessage": "Note pulling",
  "noteSync.pushStatusMessage": "Notes uploading",
  "noteSync.finishStatusMessage": "Note sync complete",
}
```

2. 开启插件工作状态。

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

### 追加commit msg会发生在一次真正的push上
在仓库无新代码push的时候，追加的提交信息控制，将会在下一个实际push的时候追加上去。即，action动作是延迟在下一个push存在变更数据的操作上。队列保存在内存。重启失效。
