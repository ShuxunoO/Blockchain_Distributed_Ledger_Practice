const SHA256 = require("crypto-js/sha256");
const LevelDB = require("./LevelDB.js");
const Block = require("./Block.js");

class Blockchain {
  constructor() {
    this.db = new LevelDB();
    this.generateGenesisBlock();
  }

  // Create a genesis block
  async generateGenesisBlock() {
    const height = await this.getBlockHeight();
    if (height === 0) {
      console.log("generateGenesisBlock | Create genesis block");
      let block = new Block("Genesis block");
      block.height = height;
      block.time = new Date().getTime().toString().slice(0, -3);
      block.hash = SHA256(JSON.stringify(block)).toString();
      this.db.addLevelDBDataWithKey(0, JSON.stringify(block));
    }
  }

  // Get block heights
  async getBlockHeight() {
    return this.db.getBlocksCount();
  }

  // Add new block
  async addBlock(block) {
    block.height = await this.getBlockHeight();
    block.time = new Date().getTime().toString().slice(0, -3);
    block.previousBlockHash = (await this.getBlock(block.height - 1)).hash
    
    block.hash = SHA256(JSON.stringify(block)).toString();
    return this.db.addLevelDBDataWithKey(block.height, JSON.stringify(block));
  }

  // Get block by height
  async getBlock(height) {
    return this.db
      .getLevelDBData(height)
      .then((block) => {
        console.log("getBlock | Successful, info:", block);
        return JSON.parse(block);
      })
      .catch((err) => {
        console.log("getBlock | Err:", err);
        return err;
      });
  }

  // Validate if block is being tampered by block height
  async validateBlock(height) {
    return this.getBlock(height).then((block) => {
      let blockHash = block.hash;
      block.hash = "";
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      block.hash = blockHash;
      // console.log('-',i + 1)
      console.log('-',validBlockHash)
      console.log('-',blockHash)
      if (validBlockHash === blockHash) {
        console.log(true)
        return { isValidBlock: true, block: block };
      } else {
        console.log(
          "validateBlock | Failed, block# " +
            height +
            " invalid hash: " +
            blockHash
        );
        return { isValidBlock: false, block: block };
      }
    });
  }

  // Validate blockchain
  validateChain() {
    let self = this;
    return this.getBlockHeight().then((height) => {
      let errorLog = [];
      for (let j = 0; j < height; j++) {
        // Validate block
        let i = j;
        self.validateBlock(i).then(({ isValidBlock, block }) => {
          console.log(block)
          if (!isValidBlock) {
            errorLog.push(i);
          }
          let blockHash = block.hash;
          // Compare blocks hash link
          if (i + 1 < height) {
            self.getBlock(i + 1).then((followingBlock) => {
              let previousHash = followingBlock.previousBlockHash;
              if (blockHash !== previousHash) {
                console.log(i)
                errorLog.push(i);
              }
            });
          }
        });
      }

      setTimeout(function () {
        if (errorLog.length > 0) {
          console.log("validateChain | The chain is not valid:");
          errorLog.forEach((error) => {
            console.log(error);
          });
        } else {
          console.log("validateChain | No errors found, The chain is Valid!");
        }
      }, 1000);
    });
  }
}

module.exports = Blockchain;
