const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const signup = async (req,res)=>{
        const {name,email,password,role="employee"}=req.body
    
    //check if user exist
    const userExist = 'SELECT * FROM users WHERE email = ?'
    db.query(userExist, [email], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).send('Database query failed');
        }
        if (results.length > 0) {
            return res.status(400).json('User already exists!Please login');
        }
    });
    //hash password
    const HashedPassword = await bcrypt.hash(password, 2);
    const newUser = 'INSERT INTO users (name,email,password,role) VALUES (?, ?, ?, ?)';
        db.query(newUser, [name,email,HashedPassword,role], (err, results) => {
            if (err) {
                console.error('Error creating the user:', err);
                return res.status(500).json({ error: 'Failed to create the new user in the database' });
            }
            res.status(201).json({ message: ' Account was successfully created', results });
        });
    
    }
    
    const login = async (req,res)=>{
        const {email,password} = req.body
    //check if the user is there
    const userExist = 'SELECT * FROM users WHERE email = ?'
    db.query(userExist, [email],async (err, results) =>{
        if(err){
            console.error('Error fetching data:',err);
            res.status(500).send('database query failed ');
    
        }
        if(results.length===0){
            return res.status(400).json("user does not exist please singup")
        }
        const user = results[0]
        
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
         return res.status(400).json("password is incorrect")
      }	
      
     
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
      
      res.status(200).json({
          message: "Login successful",
          token
      });
      });
     
    }
    
    module.exports = {signup,login}
