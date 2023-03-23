import * as vscode from 'vscode';
import { NoteSyncExtension } from './note-sync';
export function activate(context: vscode.ExtensionContext) {
	let noteSync = new NoteSyncExtension(context);
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			//这里只做一件事情 就是重新刷新配置
			noteSync.loadConfig();
		}),

		vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
			noteSync.pushGitWithLongDelay();
		}),
		
		vscode.commands.registerCommand('note-sync.syncQuickly', async () => {
			vscode.commands.executeCommand('workbench.action.files.save');

			if (noteSync.getDefaultAction() === '') {
				const INPUT = vscode.window.showInputBox({
					placeHolder: 'input string will append to git comment of the nearest time in the future'
				});

				let inputString = await INPUT;
				noteSync.requireAction(inputString);
			} else {
				noteSync.requireAction(noteSync.getDefaultAction());
			}
		})
	);

	// return extension
}

// this method is called when your extension is deactivated
export function deactivate() { }
