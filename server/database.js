const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(":memory:");

const initializeDb = () => {
  db.serialize(() => {
    const defaultUsers = [
      {
        userName: "John Cena",
        userEmail: "john@gmail.com",
        userPassword: "Password123",
      },
      {
        userName: "Steve Austin",
        userEmail: "steve@gmail.com",
        userPassword: "Password123",
      },
      {
        userName: "The Hulk",
        userEmail: "hulk@gmail.com",
        userPassword: "Password123",
      },
    ];

    // Create table at the startup
    db.run(
      `CREATE TABLE users(Id INTEGER PRIMARY KEY,UserName TEXT,UserEmail Text, UserPassword Text);`
    );

    // insert data during the startup
    console.log("map leng", defaultUsers.length);

    for (let i = 0; i < defaultUsers.length; i++) {
      //  console.log("asdf", i, defaultUsers[i]);
      const query = `insert into users ( UserName, UserEmail, UserPassword ) values 
      ('${defaultUsers[i].userName}' , '${defaultUsers[i].userEmail}', '${defaultUsers[i].userPassword}') `;
      db.run(query, function (error) {
        if (error) {
          console.log("error inserting record ");
        } else {
          console.log("inserted record ", this.lastID);
        }
      });
    }

    db.all("select * from users ", (err, rows) => {
      if (!err) {
        console.log(" retrieved records ", rows);
      }
    });
  });
};

module.exports = {
  db,
  initializeDb,
};
