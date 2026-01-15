
It is a full-stack Dashboard Application built with React,Express and MongoDB that allows users to securely sign up,log in and manage products. Authentication is handled using JWT to ensure secure access to protected routes. 

Featuers:
User Authentication
  . sign up and login functionality
  . secure authentication using JWT
  .bcrypt for password hashing
Product Mangagement
  . Add Product
  . Search Product
  . Delete Product
Protected Routes
  . Only authenticated users can access dashboard features

Full-Stack Architecture
  . Frontend: React
  . Backend: Node.js + Express
  .Database: MongoDB

  

📁 Initial Project Structure
node-dashboard-app/
├── backend/
│   ├── db/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── config.js
│   ├── index.js
│   ├── package.json
    ├── package.lock.json
│   
│
├── frontend/
│   ├── public/
               ├── index.html
│   ├── src/
             components/
                        ├── AddProduct.js
                        ├── Login.js
                        ├── Footer.js
                        ├── Nav.js
                        ├── privateComponent.js
                        ├── ProductList.js
                        ├── Profile.js
                        ├── signup.js
                        ├── Update.js
                          
│   ├── package.json
     ├── package-lock.json
│   
│
└── .gitignore




