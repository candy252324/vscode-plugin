// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	require('./src/installViewData')(context); // 为树视图提供数据
	vscode.commands.registerCommand('extension.treeItemClick', (filePath,fileName) => {
		//  打开某个文件
		let uri = vscode.Uri.file(filePath);
		vscode.window.showTextDocument(uri)  // 或 vscode.commands.executeCommand('vscode.open', uri)，打开某个文件/文件夹
	});
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}