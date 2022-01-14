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
  addLevelDBDataWithKey(key, value) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.db.put(key, value, function (err) {
        if (err) {
          reject(err);
          return console.log("addLevelDBDataWithKey | Failed:", err);
        }
        console.log(
          "addLevelDBDataWithKey | Successful, key:",
          key,
          "value:",
          value
        );
        resolve(value);
      });
    });
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
  getBlocksCount() {
    let self = this;
    var i = 0;
    return new Promise(function (resolve, reject) {
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
  }
}

module.exports = LevelDB;
