var fs=require("fs");
const vscode = require('vscode');
const readAllFile=require('./readAllFile');


module.exports = function(context) {
    if(!vscode.window.activeTextEditor){
        return
    }
    // 注册TreeDataProvider
    let provider=new TreeProvider()
    // https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
    // TreeDataProvider应用于panel1
    vscode.window.registerTreeDataProvider('panel1',provider );
    vscode.commands.registerCommand('panel1.refreshEntry', () => provider.refresh());
};

class TreeProvider{
    constructor(){
        this.allReference=findAllReference()
        // this._onDidChangeTreeData=new vscode.EventEmitter() 
    }
    refresh(){
        vscode.window.registerTreeDataProvider('panel1',new TreeProvider() );
        vscode.window.showInformationMessage('已刷新！');
        // this._onDidChangeTreeData.fire();
    }
    getChildren(element){ 
        if(this.allReference.length){
            return this.allReference.map((item,idx)=>{return {
                id:idx,
                fileName:item.fileName,
                filePath:item.filePath,
                collapsibleState:0,
            }})
        }       
      
        // if(element){
        //     return [
        //         {
        //             id:"3",
        //             name:'3级',
        //             tooltip:'tooltip3',
        //             collapsibleState:0
        //         },
        //     ]
        // }else{
        //     return [
        //         {
        //             id:"1",
        //             name:'1级',
        //             tooltip:'tooltip1',
        //             collapsibleState:1   
        //         },
        //         {
        //             id:"2",
        //             name:'2级',
        //             tooltip:'tooltip2',
        //             collapsibleState:0
        //         }
        //     ]
        // }
    }
    getTreeItem(item){
        return {
            id: `${item.id}`,
            collapsibleState: item.collapsibleState,  // 是否可展开，注：这里不要使用字符串模板，会导致渲染不正确
            label: `${item.fileName}`,
            tooltip: `${item.filePath}`,
            // iconPath: vscode.Uri.parse(item.avatarUrl),
            command:{
                command:"extension.treeItemClick",  // 点击事件
                title:"",
                arguments:[item.filePath,item.fileName]  // 传给点击事件的参数
            }
        }
    }
}


/**
 * 获取所有引用文件
 * [{
 *  fileName:"example.vue",   // 文件名称
 *  filePath:"C:/example/example.vue",  // 文件绝对路径
 *  relyonTargetFile:true,    //  是否依赖了目标文件
 *  dependencies:["C:/example/comp1.vue","C:/example/comp2.vue"]  // 依赖的所有文件
 * }]
 */
function findAllReference(){
    // 当前激活状态的文件路径，格式如： ""c:\Users\cjh\Desktop\vscode-plugin-test\src\comp\header.vue""
    let activeFilePath = vscode.window.activeTextEditor.document.fileName
    // 当前项目根目录路径，格式如："c:\Users\cjh\Desktop\vscode-plugin-test"
    let rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath
    if(fs.existsSync(rootPath+"/src")){
        return readAllFile(activeFilePath, rootPath+"/src")
    }else{
        vscode.window.showInformationMessage('路径不存在！');
        return []
    }
}