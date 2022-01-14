const SHA256 = require("crypto-js/sha256");
const Blockchain = require("./BlockChain.js");
console.log(Blockchain)
const LevelDB = require("./LevelDB.js");
const Block = require("./Block.js");

async function test2() {
  /**
   * Test only one function once time
   * Comment all test statements when test the others *.js code
   */
  var blockchain = new Blockchain();
  setTimeout(function () {
      console.log('00000')
    /**
     * theLoop for using add test data before testing
     * Genesis new block per 10 seconds
     */
    // theLoop(0);
    // testGenerateGenesisBlock();
    // testGetBlockHeight();
    // testGetBlock(5);
    // testAddBlock();
    // tamperBlock(5);
    // testValidateBlock(5);
    // testValidateChain();
  }, 1000);
}
test2();

/**
 * Test codes below
 */
function testGenerateGenesisBlock() {
  blockchain.getBlock(0).then((block) => {
    console.log("testGenerateGenesisBlock | Successful, genesis block:", block);
  });
}

function testGetBlockHeight() {
  blockchain.getBlockHeight().then((height) => {
    console.log("testGetBlockHeight | Successful, blockchain height:", height);
    return height;
  });
}

function testGetBlock(height) {
  blockchain.getBlock(height).then((block) => {
    console.log("testGetBlock | Successful, block:", block);
  });
}

function testAddBlock() {
  blockchain.addBlock(new Block.Block("test1")).then((height) => {
    console.log("testAddBlock | Successful, block height:", height);
  });
}

function testValidateBlock(height) {
  blockchain.validateBlock(height).then(({ isValidBlock, block }) => {
    console.log(
      "testValidateBlock | Block# " +
        height +
        " is " +
        (isValidBlock ? "valid" : "invalid")
    );
  });
}

function testValidateChain() {
  blockchain.validateChain();
}

// Create Tests Blocks, generate new block per 10 seconds
function theLoop(i) {
  setTimeout(function () {
    let blockTest = new Block.Block("Test Block - " + (i + 1));
    blockchain.addBlock(blockTest).then((height) => {
      console.log("theLoop | block height:", height);
      i++;
      if (i < 10) theLoop(i);
    });
  }, 10 * 1000);
}

// Tampering a Block for the purpose of testing the validation methods
function tamperBlock(height) {
  blockchain.getBlock(height).then((block) => {
    let tamperdBlock = block;
    tamperdBlock.body = "Tampered Block";
    blockchain.bd
      .addLevelDBDataWithKey(tamperdBlock.height, JSON.stringify(tamperdBlock))
      .then((block) => {
        console.log("tamperBlock | Tampered block", height);
      });
  });
}
