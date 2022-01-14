const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(data) {
    this.hash = "";
    this.height = 0;
    this.body = data;
    this.time = 0;
    this.previousBlockHash = ""
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.addBlock(new Block("Genesis block"));
  }

  // Add new block
  addBlock(newBlock) {
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    // Previous block hash
    if (this.chain.length > 0) {
      newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
    }
    // Block hash
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // console.log(newBlock);
    // Adding block object to chain
    this.chain.push(newBlock);
  }

  // Get block height
  getBlockHeight() {
    return this.chain.length - 1;
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  }

  // validate block
  validateBlock(blockHeight) {
    // get block object
    let block = this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash === validBlockHash) {
      return true;
    } else {
      console.log('Block # ' + blockHeight + ' invalid hash:\n' + blockHash + ' <> ' + validBlockHash);
      return false;
    }
  }

  // Validate blockchain
  validateChain() {
    let errorLog = [];
    for (var i = 0; i < this.chain.length - 1; i++) {
      // Validate block
      if (!this.validateBlock(i)) {
        errorLog.push(i);
      }
      // Compare blocks hash
      let blockHash = this.chain[i].hash;
      let previousHash = this.chain[i + 1].previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }

  // 打印当前chain数据
  printChain() {
    console.log(this.chain)
  }
}

module.exports = { Block, Blockchain }
