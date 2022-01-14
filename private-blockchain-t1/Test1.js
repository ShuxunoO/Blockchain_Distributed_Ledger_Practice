const { Block, Blockchain } = require("./BlockChain.js");

function test1() {
  // 实例化myBlockChain对象，创建Genesis block
  var myBlockChain = new Blockchain();

  // A.测试创建Genesis block，并创建11个区块，并上链，然后调用自己编写的printChain函数打印内存中区块链chain的数据
  console.log("=====================测试创建区块并上链======================");

  for (var i = 0; i <= 10; i++) {
    myBlockChain.addBlock(new Block("test data " + i));
  }
  // 打印当前链数据
  myBlockChain.printChain();

  // B.测试打印区块高度
  console.log("=====================测试打印区块高度======================");
  console.log(myBlockChain.getBlockHeight());

  // C.测试查看区块
  console.log("=====================测试查看区块======================");
  console.log(myBlockChain.getBlock(9));

  // D.测试验证区块
  console.log("=====================测试验证区块======================");
  console.log(myBlockChain.validateBlock(9));

  // E.测试验证区块链
  console.log("=====================测试验证区块链======================");
  myBlockChain.validateChain();
}

test1();
