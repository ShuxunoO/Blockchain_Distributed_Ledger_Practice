const SHA256 = require('crypto-js/sha256');
const LevelDB = require("./LevelDB");
const levelDB = new LevelDB("test_level");

async function TestLevelDB() {
  //   await testGetLevelDBData();
    await testAddLevelDBDataWithKey();
//   await testGetBlocksCount();
}
TestLevelDB();

// Test code
async function testGetLevelDBData() {
  try {
    await levelDB.db.put("test_key", "test_val");
    const block = await levelDB.getLevelDBData("test_key");
    console.log("testGetLevelDBData | Value:", block);
  } catch (error) {
    console.log("testGetLevelDBData | Err:", error);
  }
}

async function testAddLevelDBDataWithKey() {
  try {
    const block = await levelDB.addLevelDBData(SHA256(`${Math.random()}`));
    console.log("testAddLevelDBDataWithKey | Value:", block);
  } catch (error) {
    console.log("testAddLevelDBDataWithKey | Err:", error);
  }
}

async function testGetBlocksCount() {
  try {
    const count = await levelDB.getBlocksCount();
    console.log("testGetBlocksCount | Count:", count);
  } catch (error) {
    console.log("testGetBlocksCount | Err:", error);
  }
}

function testAddLevelDBData() {
  levelDB
    .addLevelDBData("test data")
    .then((value) => {
      console.log("testAddLevelDBData | Success, value:", value);
    })
    .catch((err) => {
      console.log("testAddLevelDBData | Err:", err);
    });
}

/**
 * Test only one function once time
 * Comment all test statements when test the others *.js code
 */
// let levelDB = new LevelDB();
// testGetLevelDBData();
// testAddLevelDBDataWithKey();
// testGetBlocksCount();
// testAddLevelDBData();
