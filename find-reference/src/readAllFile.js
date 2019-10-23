const fs = require('fs');
const path = require('path');


module.exports = function (aimFile, root){
  function readFile(path){
    var files = fs.readdirSync(path);
    //遍历根目录得到所有文件的绝对路径
    files.forEach(function (file) {
      let filePath=path+"/"+file
      let isDir=fs.lstatSync(filePath).isDirectory()
      if(isDir){ // 是文件夹
        readFile(filePath)
      }else{
        allFilePath.push(filePath)
      }
    });
  }

  let allFilePath=[]
  readFile(root)

  let importsRelations=[]
  allFilePath.forEach((filePath,idx)=>{
    let obj={}
    obj.fileName=path.basename(filePath)  // path.basename:通过路径获取文件名
    obj.relyonTargetFile=false  // 是否依赖目标文件
    obj.filePath=filePath
    obj.dependencies=[]
    const fileText=fs.readFileSync(filePath,'utf-8')
    // 遍历文件内容，匹配出所有格式为 “import from ""” 或“import from ''” 的代码
    let dependenciesArr=fileText.match(/import.*?from.*?('|").*?('|")/g)
    if(!dependenciesArr) return
    dependenciesArr.forEach(item=>{
      // 依赖文件的相对路径，"../example/index.vue" 或 "@/example/index.vue" 或 "@/example"
      let expPath=item.replace(/(.*)('|")(.*)('|")/g,'$3')
      // 处理成绝对路径
      let finalPath=path.resolve(filePath,'../',expPath)  // 未处理@的情况,未处理注释,未处理index.vue
      if(!obj.dependencies.includes(finalPath)){
        obj.dependencies.push(finalPath)
        if(path.normalize(aimFile)===path.normalize(finalPath)){
          obj.relyonTargetFile=true
          importsRelations.push(obj)
        }
      } 
    })
  })
  return importsRelations
}