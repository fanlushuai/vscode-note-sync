# Change Log

## [1.0.1]
1. 优化逻辑过程。命令变更，使用syncQuckly 和requireAction替换sync。

2. Adapt to original repo version 1.0.3.

> source repo log:
> [1.0.3]
> ~~change timeout to delayTime~~ delaytime be replaced by shortDelayTime in this forked version
> change runningStatusMessage to pushStatusMessage
> fix pushCommand not in effect

## [1.0.0]
1. 添加，命令，主动触发push。使得原本，只有onsave情况下的触发。增加一种主动触发的情况。可以分别调整delaytime。既可以保持原有后台自动化的要求。又可以主动介入去快速触发。（这在某些情况下是有用的）
2. 允许追加comment。配合gihtub action，实现提交信息控制action。追加消息主要目的是用于控制action。


--- forked from source repo from 1.0.2

## [1.0.2]

fix commit message err

## [1.0.0]

publish 1.0.0 

# [Unreleased]
