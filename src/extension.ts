import * as vscode from 'vscode';
import { NoteSyncExtension } from './note-sync';
export function activate(context: vscode.ExtensionContext) {
	let noteSync = new NoteSyncExtension(context);
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			//这里只做一件事情 就是重新刷新配置
			noteSync.loadConfig();
		}),
		//  todo 添加命令active插件 
		//  {
		// 	"command": "extension.enableNoteSync",
		// 	"title": "Note Sync: Enable"
		//   },
		//   {
		// 	"command": "extension.disableNoteSync",
		// 	"title": "Note Sync: Disable"
		//   }
		// vscode.commands.registerCommand('extension.enableNoteSync', () => {
		// 	//执行enable命令时 修改配置并开启插件
		// 	console.log("loading1")
		// }),

		// vscode.commands.registerCommand('extension.disableNoteSync', () => {
		// 	//执行disableNoteSync命令时 修改配置并关闭插件
		// 	console.log("loading2")
		// }),
		//todo文件保存前需要做的事情放这里
		// vscode.workspace.onWillSaveTextDocument((e: vscode.TextDocumentWillSaveEvent) => {
		// 	
		// 	if (isActive) {

		// 	}
		// }),

		vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
			noteSync.pushGitWithLongDelay();
		}),
		vscode.commands.registerCommand('note-sync.sync', () => {
			noteSync.pushGitWithShortDelay();
		})
	);

	// return extension
}

// this method is called when your extension is deactivated
export function deactivate() { }
