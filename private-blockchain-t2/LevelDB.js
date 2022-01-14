const level = require("level");
const chainDB = "./chaindata";

class LevelDB {
  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key
  async getLevelDBData(key) {
    return this.db.get(key);
  }

  // Add data to levelDB with key and value
  async addLevelDBDataWithKey(key, value) {
    try {
      await this.db.put(key, value)
      console.log(
        "addLevelDBDataWithKey | Successful, key:",
        key,
        "value:",
        value
      );
    } catch (error) {
      console.log("addLevelDBDataWithKey | Failed:", error);
    }
    return this.getBlocksCount()
  }

  // Add data to levelDB with value
  async addLevelDBData(value) {
    const count = await this.getBlocksCount();
    let val = "";
    try {
      val = await this.addLevelDBDataWithKey(count, value);
      console.log("addLevelDBData | Success, value:", value);
    } catch (error) {
      console.log("addLevelDBData | Err:", error);
    }
    return value;
  }

  // Method that return the height
  async getBlocksCount() {
    const self = this;
    let i = 0;
    await new Promise(function (resolve, reject) {
      self.db
        .createReadStream()
        .on("data", function (data) {
          i++;
        })
        .on("error", function (err) {
          reject(err);
          return console.log("getBlocksCount | Failed:", err);
        })
        .on("close", function () {
          console.log("getBlockCount | Successful, count:", i);
          resolve(i);
        });
    });
    return i
  }
}

module.exports = LevelDB;
