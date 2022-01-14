const SHA256 = require("crypto-js/sha256");
const Blockchain = require("./BlockChain.js");
const LevelDB = require("./LevelDB.js");
const Block = require("./Block.js");

var blockchain = new Blockchain();
async function test2() {
  /**
   * Test only one function once time
   * Comment all test statements when test the others *.js code
   */

  await theLoop(0);
  await testGenerateGenesisBlock();
  await testGetBlockHeight();
  await testGetBlock(5);
  await testAddBlock();
  await tamperBlock(5);
  await testValidateBlock(5);
  await testValidateChain();
}
test2();

/**
 * Test codes below
 */
async function testGenerateGenesisBlock() {
  const block = await blockchain.getBlock(0);
  console.log("testGenerateGenesisBlock | Successful, genesis block:", block);
}

async function testGetBlockHeight() {
  const height = await blockchain.getBlockHeight();
  console.log("testGetBlockHeight | Successful, blockchain height:", height);
}

async function testGetBlock(height) {
  blockchain.getBlock(height).then((block) => {
    console.log("testGetBlock | Successful, block:", block);
  });
}

async function testAddBlock() {
  blockchain.addBlock(new Block("test1")).then((height) => {
    console.log("testAddBlock | Successful, block height:", height);
  });
}

async function testValidateBlock(height) {
  blockchain.validateBlock(height).then(({ isValidBlock, block }) => {
    console.log(
      "testValidateBlock | Block# " +
        height +
        " is " +
        (isValidBlock ? "valid" : "invalid")
    );
  });
}

async function testValidateChain() {
  blockchain.validateChain();
}

// Create Tests Blocks, generate new block per 10 seconds
async function theLoop(i) {
  setTimeout(async function () {
    let blockTest = new Block("Test Block - " + (i + 1));
    const height = await blockchain.addBlock(blockTest);
    console.log("theLoop | block height:", height);
    if (++i < 10) theLoop(i);
  }, 10 * 1000);
}

// Tampering a Block for the purpose of testing the validation methods
async function tamperBlock(height) {
  blockchain.getBlock(height).then((block) => {
    let tamperdBlock = block;
    tamperdBlock.body = "Tampered Block";
    blockchain.db
      .addLevelDBDataWithKey(tamperdBlock.height, JSON.stringify(tamperdBlock))
      .then((block) => {
        console.log("tamperBlock | Tampered block", height);
      });
  });
}
