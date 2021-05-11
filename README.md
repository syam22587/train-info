# train-info

To run the application follow below instructions. 

# To run Server Application
Open a terminal in application root folder, move to **server** folder. 
```npm install```  and  ``` npm start```

This runs the server application in 4001 port

In another
Open an another terminal in application root folder, move to **client** folder. 
```npm install``` and ``` npm start```

This runs the server application in 3000 port

Open the browser, and verify the application in http://localhost:3000

By default,every server restart creates below users in in-memory database (Sqllite3)
1. john@gmail.com / Password123
2. steve@gmail.com / Password123
3. hulk@gmail.com / Password123

Apart from the above users, Sign up registration also inserts new user details in the sql database. 

Note: If server is restarted, newly created data will be erased and front-end screen may show no data in my-profile page. 
