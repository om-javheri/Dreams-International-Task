const express=require("express")
const mysql=require("mysql")
const cors=require("cors")
const app=express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const db=mysql.createConnection({
    host:`${process.env.MYSQLHOST}`,
    user:`${process.env.MYSQLUSER}`,
    password:`${process.env.MYSQLPASSWORD}`,
    database:`${process.env.MYSQLDATABASE}`,
    debug:true
});

app.post('/SignupAuthor', (req, res) => {
    
      const sql = "INSERT INTO signupauthor (`name`, `email`, `password`,`accountType`) VALUES (?,?, ?, ?)";
      
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const accountType="Author";
      
      db.query(sql, [name,email,password,accountType], (err, data) => {
        if (data) {
          
          res.send(data);
          console.log("Author Data inserted successfully:", data);
        }
        else{
            res.send({message:"Error "})

        }
        
        
      });
   
  });
  app.post('/SignupReader', (req, res) => {
    
    const sql = "INSERT INTO signupauthor (`name`, `email`, `password`,`accountType`) VALUES (?,?, ?, ?)";
    
      const name=req.body.name;
      const email=req.body.email;
      const password=req.body.password;
      const accountType="Reader";
    
    db.query(sql, [name,email,password,accountType], (err, data) => {
      if (data) {
        
        res.send(data);
        console.log("Reader Data inserted successfully:", data);
      }
      else{
          res.send({message:"Error "})

      }
      
      
    });
 
});

  app.post('/Login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const sql = `SELECT * FROM signupauthor WHERE email=? AND password=?`;

    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error("Error", err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (data.length > 0) {
                // User found, check author status
                const user = data[0];
                if (user.admin_status === 1) {
                    console.log("Author login successful");
                    res.send({ ...user, isAuthor: true });
                } else {
                    console.log("Reader login successful");
                    res.send({ ...user, isAuthor: false });
                }
            } else {
                res.status(401).json({ message: "Incorrect username or password" });
            }
        }
    });
});


app.post('/Create', (req, res) => {
    
  const sql = "INSERT INTO bookCollection(author_id,cover ,title,description,genre,publishDate,price,tags,status)VALUES(?,?,?,?,?,?,?,?,?)";
  
   const author_id=req.body.author_id;
    const cover=req.body.cover;
    const title=req.body.title;
    const description=req.body.description;
    const genre=req.body.genre;
    const publishDate=req.body.publishDate;
    const price=req.body.price;
    const tags=req.body.tags;
    const status=req.body.status;

   
  
  db.query(sql, [author_id,cover,title,description,genre,publishDate,price,tags,status], (err, data) => {
    if (err) {
      
      req.setEncoding({err:err});
      console.log("Error");
    }
    else{
      if(data.length>0){
          console.log("create succesful")
          res.send(data)

      }
      else{
          res.send({message:"Incorrect username or password"})
      }
        

    }
    
    
  });

});



app.get('/ShowAndId', (req, res) => {

  const sql = `SELECT * FROM bookCollection ;`;
 
  
  db.query(sql,[], (err, data) => {
    if (err) {
      console.error("Error", err);
      res.status(500).json({ message: "Failed to show data" });
    } else {
      if (data.length > 0) {
        console.log("Data shown successfully");
        res.json(data);
      } else {
        res.json({ message: "No data found" });
      }
    }
  });
});



app.get('/ShowAndBookId', (req, res) => {
  const sql = "SELECT bookcollection.id AS book_id, author_id,cover,title,description,genre,price,COALESCE(AVG(rating), 'NA') AS rating FROM bookcollection LEFT JOIN Reviews ON bookcollection.id = Reviews.book_id WHERE status = 'Published' GROUP BY bookcollection.id, author_id,cover, title,description,genre,price;";
  
 
  
  db.query(sql,[], (err, data) => {
    if (err) {
      console.error("Error", err);
      res.status(500).json({ message: "Failed to show data" });
    } else {
      if (data.length > 0) {
        console.log("Data shown successfully");
        res.json(data);
      } else {
        res.json({ message: "No data found" });
      }
    }
  });
});


app.post('/Review', (req, res) => {
  const comment = req.body.review;
  const rating = req.body.rating;

  const book_id = req.body.book_id;

  const sql = "INSERT INTO Reviews(book_id ,comment,rating)VALUES(?,?,?)";

  db.query(sql, [book_id,comment, rating], (err, data) => {
      if (err) {
          console.error("Error", err);
          res.status(500).json({ message: "Internal Server Error" });
      } else {
          if (data.length > 0) {
              // User found, check admin status
              const user = data[0];
              if (user.admin_status === 1) {
                  console.log("Author login successful");
                  res.send({ ...user, isAuthor: true });
              } else {
                  console.log("Reader login successful");
                  res.send({ ...user, isAuthor: false });
              }
          } else {
              res.status(401).json({ message: "Incorrect username or password" });
          }
      }
  });
});
app.get('/ShowReview', (req, res) => {

  const sql = `SELECT * FROM Reviews ;`;
 
  
  db.query(sql,[], (err, data) => {
    if (err) {
      console.error("Error", err);
      res.status(500).json({ message: "Failed to show data" });
    } else {
      if (data.length > 0) {
        console.log("Data shown successfully");
        res.json(data);
      } else {
        res.json({ message: "No data found" });
      }
    }
  });
});


app.get('/ShowAllAndReview', (req, res) => {
  const sql = "  select book_id,AVG(rating) from bookcollection,Reviews where bookcollection.id=book_id group by book_id;"
  
 
  
  db.query(sql,[], (err, data) => {
    if (err) {
      console.error("Error", err);
      res.status(500).json({ message: "Failed to show data" });
    } else {
      if (data.length > 0) {
        console.log("Data shown successfully");
        res.json(data);
      } else {
        res.json({ message: "No data found" });
      }
    }
  });
});

app.post('/Edit2', (req, res) => {
    
  const sql = `UPDATE bookcollection SET  cover=? ,title=?,description=?,genre=?,publishDate=?,price=?,tags=?,status=? WHERE id=?;`;
  
   
  const id=req.body.id;
  const cover=req.body.cover;
  const title=req.body.title;
  const description=req.body.description;
  const genre=req.body.genre;
  const publishDate=req.body.publishDate;
  const price=req.body.price;
  const tags=req.body.tags;
  const status=req.body.status;
   
  
  db.query(sql, [cover,
    title,
    description,
    genre,
    publishDate,
    price,
    tags,
    status,id], (err, data) => {
    if (err) {
      
      req.setEncoding({err:err});
      console.log("Error");
    }
    else{
      if(data.affectedRows>0){
          console.log("Edit succesful")
          res.send(data)
          console.log(data)

      }
      else{
          res.send({message:"No such record"})
      }
        

    }
    
    
  });

});






db.connect((err,values) => {
    if (err) {
      console.error('Error connecting to database: ', err);
      return;
    }
    console.log('Connected to database!');
    app.listen(`${process.env.MYSQLPORT}`, () => {
      console.log("Server is listening on port ",values);
    });
  });
