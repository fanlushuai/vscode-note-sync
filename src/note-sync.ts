import { exec, ChildProcess } from "child_process";
import * as vscode from "vscode";
// import {RawCommand, CommandProcessor, BackendCommand, TerminalCommand, VSCodeCommand} from './command-processor'
export class NoteSyncExtension {
    private context: vscode.ExtensionContext;
    private config!: vscode.WorkspaceConfiguration;
    private channel: vscode.OutputChannel = vscode.window.createOutputChannel(
        "Note Sync"
    );
    // private commandProcessor: CommandProcessor = new CommandProcessor()
    private timer!: any;
    private commentQueue: Array<string>;
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadConfig();
        this.showEnablingChannelMessage();
        this.commentQueue = [];

        context.subscriptions.push(this.channel);
        this.pullCode();
    }
    private showEnablingChannelMessage() {
        let message = `Note Sync is ${this.getEnabled() ? "enabled" : "disabled"}`;
        this.showChannelMessage(message);
        this.showStatusMessage(message);
    }
    loadConfig() {
        this.config = vscode.workspace.getConfiguration("noteSync");
    }
    //判断插件是否开启
    getEnabled(): boolean {
        return (
            !!this.context.globalState.get("enabled", true) &&
            !!this.config.enableNoteSync
        );
        // return true;
    }
    //右下角弹框提示
    private showChannelMessage(message: string) {
        this.channel.appendLine(message);
    }
    //左下角状态栏提示
    private showStatusMessage(message: string) {
        let disposable = vscode.window.setStatusBarMessage(
            message,
            this.config.get("longDelayTime") || 1000
        );
        this.context.subscriptions.push(disposable);
    }
    //执行脚本
    private execShellCommand(command: string): ChildProcess {
        let shell = this.getShellPath();
        if (shell) {
            return exec(command, {
                shell,
                cwd: vscode.workspace.rootPath,
            });
        } else {
            return exec(command);
        }
    }
    // 获取脚本环境 unix上默认是/bin/sh，windows上默认是cmd.exe
    private getShellPath(): string | undefined {
        return this.config.get("shell") || undefined;
    }
    private pullCommand(): string | undefined {
        return this.config.get("pullCommand") || undefined;
    }
    private pushCommand(): string | undefined {
        return this.config.get("pushCommand") || undefined;
    }
    //下拉笔记
    private pullCode() {
        if (!this.getEnabled()) {
            return;
        }
        let path = vscode.workspace.rootPath;
        let pullShell = this.pullCommand() ?? `git -C "${path}" pull -f`;
        return new Promise((resolve) => {
            this.showChannelMessage(`Running ${pullShell}`);
            if (this.config.pullStatusMessage) {
                this.showStatusMessage(this.config.pullStatusMessage);
            }
            //使用git同步
            let child = this.execShellCommand(pullShell);
            child?.stdout?.on("data", (data) => this.channel.append(data.toString()));
            child?.stderr?.on("data", (data) => this.channel.append(data.toString()));
            child.on("exit", async (e) => {
                if (e === 0 && this.config.finishStatusMessage) {
                    this.showStatusMessage(this.config.finishStatusMessage);
                }

                if (e !== 0) {
                    this.channel.show(true);
                }
                resolve();
            });
        }) as Promise<void>;
    }
    //提交笔记
    private pushCode(delayTime: number = 5000) {
        if (!this.getEnabled()) {
            return;
        }

        //添加缓存
        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }
        return new Promise((resolve) => {
            this.timer = setTimeout(() => {
                this.timer = undefined;
                let path = vscode.workspace.rootPath;
                console.log(path);
                let pushComment = this.config.pushCommit ?? "note sync plugin synchronization";
                let commentAppend = this.commentQueue[0] ?? '';
                let pushShell =
                    this.pushCommand() ??
                    `git -C "${path}" add .&&git -C "${path}" commit -m "${pushComment} ${commentAppend}"&&git -C "${path}" push -u origin HEAD`;
                // sleep ${this.config.timeout}&
                console.log(pushShell);

                this.showChannelMessage(`Running ${pushShell}`);
                if (this.config.pushStatusMessage) {
                    this.showStatusMessage(this.config.pushStatusMessage);
                }
                //同步
                let error = "";
                let info = "";
                let child = this.execShellCommand(pushShell);
                child?.stdout?.on("data", (data) => {
                    info += data;
                    this.channel.append(data.toString());
                }

                );
                child?.stderr?.on("data", (data) => {
                    error += data;
                    this.channel.append(data.toString());
                });
                child.on("exit", (e) => {
                    if (e === 0 && this.config.finishStatusMessage) {
                        this.showStatusMessage(this.config.finishStatusMessage + '(' + commentAppend + '-Done)');
                        //消息消费成功，再销毁。主要解决，存在触发提交，但是并没有提交任何代码的情况。导致追加消息动作并不能真实提交给远程仓库。
                        this.commentQueue.shift();
                    }
                    if (e !== 0) {
                        if (error.indexOf("git pull ...") !== -1) {
                            this.pullCode();
                        } else if (info.indexOf("Your branch is up to date with") !== -1) {
                            if (commentAppend !== '') {
                                // 提醒并没有真正触发，需要等到下一个周期
                                this.showChannelMessage(this.config.finishStatusMessage + '(' + commentAppend + '-Next )');
                            } else {
                                // 排除情况。当执行一次无效的提交，会出现Your branch is up to date with 'origin/main'。这主要是因为，通过快捷键主动触发的方式导致。这是无关紧要的。
                                this.showStatusMessage(this.config.finishStatusMessage + "(Nothing upload)");
                            }
                        } else {
                            this.showStatusMessage(this.config.finishStatusMessage + "(Error!)");
                        }
                    }
                    resolve();
                });
            }, delayTime);
        }) as Promise<void>;
    }

    //用于文本保存时触发。
    pushGitWithLongDelay() {
        this.pushCode(this.config.longDelayTime || 5 * 1000);
    }

    //提供其他触发。可以绑定命令，绑定其他快捷键。设置超时时间。
    //short delay受到 js 底层调度的影响，并不能很及时。必须一些其他操作才能。
    pushGitWithShortDelay() {
        this.pushCode(this.config.shortDelayTime || 1 * 1000);
    }

    requireAction(futureCommentAppend: string = '') {
        //不存在再添加。保证未来相同任务只有一次
        if (this.commentQueue.indexOf(futureCommentAppend) < 0) {
            this.commentQueue.push(futureCommentAppend);
        }

        this.pushGitWithShortDelay();
    }

    getDefaultAction() {
        return this.config.defaultAction || '';
    }


}

